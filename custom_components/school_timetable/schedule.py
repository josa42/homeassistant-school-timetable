"""Turn stored timetables into school days.

Pure functions over `SchoolData`, with no Home Assistant objects and no I/O. The
calendar platform calls this on every request instead of materialising events,
so an edit in the panel is visible immediately and storage never grows.
"""

from __future__ import annotations

from collections.abc import Iterator
from dataclasses import dataclass
from datetime import date, time, timedelta

from .models import Kid, SchoolData


@dataclass(slots=True)
class ScheduledLesson:
    """One lesson on a concrete date, with its bell times resolved."""

    period: int
    subject: str
    start: time
    end: time


@dataclass(slots=True)
class SchoolDay:
    """One day a kid has school, with every lesson that day."""

    date: date
    lessons: list[ScheduledLesson]

    @property
    def start(self) -> time:
        return self.lessons[0].start

    @property
    def end(self) -> time:
        return self.lessons[-1].end

    def description(self) -> str:
        """The lesson list that goes into the event description.

        Times stay on 24-hour HH:MM: the 12/24-hour choice is a per-user
        frontend setting that the server cannot see.
        """
        return "\n".join(
            f"{lesson.start.strftime('%H:%M')} {lesson.subject}" for lesson in self.lessons
        )


def school_days(data: SchoolData, kid: Kid, start: date, end: date) -> Iterator[SchoolDay]:
    """Yield each school day for `kid` between `start` and `end`, both inclusive.

    A date produces a day when a timetable is in force, that weekday has at
    least one lesson whose period is defined, the date is not a shared closed
    day, and the kid has no personal day off.
    """
    day = start
    while day <= end:
        school_day = school_day_for(data, kid, day)
        if school_day is not None:
            yield school_day
        day += timedelta(days=1)


def school_day_for(data: SchoolData, kid: Kid, day: date) -> SchoolDay | None:
    """Return the school day for `kid` on `day`, or None when there is none."""
    timetable = kid.timetable_for(day)
    if timetable is None:
        return None
    if data.is_closed(day) or kid.is_day_off(day):
        return None

    periods = timetable.period_map()
    lessons = [
        ScheduledLesson(
            period=lesson.period,
            subject=lesson.subject,
            start=periods[lesson.period].start,
            # A Doppelstunde runs to the end of the last period it covers, or
            # to the end of its own if the schedule is shorter than its span.
            end=max(
                (periods[number].end for number in lesson.covers() if number in periods),
                default=periods[lesson.period].end,
            ),
        )
        # A lesson whose period was deleted from the bell schedule has no times
        # and is skipped; the panel only offers defined periods.
        for lesson in timetable.lessons
        if lesson.weekday == day.weekday() and lesson.period in periods
    ]
    if not lessons:
        return None

    lessons.sort(key=lambda lesson: (lesson.start, lesson.period))
    return SchoolDay(date=day, lessons=lessons)

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AuthService } from 'src/app/shared/services/auth.service';
import { EventService } from 'src/app/shared/services/event.service';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, AfterViewInit {
  @ViewChild('fc') fc: FullCalendarComponent;
  events: EventInput[] = [];
  options: any;
  startOfWeek: Date;

  constructor(
    public authService: AuthService,
    private eventService: EventService,
    public dashboardService: DashboardService,
    public datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const today = new Date();
    this.startOfWeek = new Date(today);
    this.startOfWeek.setDate(today.getDate() - today.getDay()); // Start of current week (Sunday)

    this.options = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'timeGridWeek', // Use week view
      initialDate: this.startOfWeek, // Start from the first day of the current week
      validRange: { start: this.startOfWeek }, // Prevents past weeks from showing
      firstDay: 0, // 0 = Sunday, change to 1 for Monday
      scrollTime: '08:00:00', // Scroll to 8 AM to show the week clearly
      headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: 'today'
      },
      buttonText: {
        today: 'Today',
        prev: '←',
        next: '→'
      },
      height: '100%',
      displayEventTime: true,
      eventDisplay: 'block'
    };

    // Load events
    this.dashboardService.getUserSaved().subscribe((data) => {
      this.processCalendarData(data);
    });
  }

  ngAfterViewInit(): void {
    // Force the calendar to focus on the current week's first day
    if (this.fc) {
      this.fc.getApi().gotoDate(this.startOfWeek);
    }
  }

  processCalendarData(calendarData: any[]): void {
    const eventList = calendarData.map((element) => {
      const formattedDate = this.formatDate(element.eventDate);
      return {
        id: element.savedId,
        title: `${element.clientName} - ${element.savedId}`,
        start: formattedDate,
        allDay: true,
        backgroundColor: '#0d89ec',
        borderColor: '#0d89ec'
      };
    });

    this.events = [...eventList];

    // Refresh Calendar
    if (this.fc) {
      const calendarApi = this.fc.getApi();
      calendarApi.removeAllEvents();
      calendarApi.addEventSource(this.events);
    }
  }

  formatDate(dateStr: string): string {
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
}

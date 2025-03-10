import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

import { FullCalendar } from 'primeng/fullcalendar';
import { Calendar } from '@fullcalendar/core'; // include this line
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick

import { EventService } from 'src/app/shared/services/event.service';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  events: any[];

  options = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    defaultDate: '2017-02-01',
    header: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    }
  }
  calanderFullData: any;
  data: { data: { id: any; title: any; start: string; }[]; };
  pushArr: any[];
  constructor(public authService: AuthService,
    private eventService: EventService,
    public dashboardService: DashboardService,
    public datePipe: DatePipe
  ) {
    const name = Calendar.name; // add this line in your constructor
  }
  @ViewChild('fc') fc: FullCalendar;

  gotoDate(date: Date) {
    this.fc.getCalendar().gotoDate(date);
  }
  ngOnInit(): void {
    this.dashboardService.getUserSaved().subscribe(data => {
      this.calanderFullData = data;
      console.log(this.calanderFullData);
      this.getData();
    });
  }

  getData() {
    this.pushArr = [];
    this.calanderFullData.forEach(element => {
      let splitdate = element.eventDate.split('-');
      let actDate = splitdate[2] + '-' + splitdate[1] + '-' + splitdate[0];
      let arr = {
        "id": element.savedId,
        "title": element.clientName + '-' + element.savedId,
        "start": actDate
      }
      this.pushArr.push(arr);
    });
    console.log(this.pushArr)
    this.events = this.pushArr;

  }

}

var StartDay;
(function (StartDay) {
    StartDay[StartDay["Sunday"] = 1] = "Sunday";
    StartDay[StartDay["Monday"] = 2] = "Monday";
})(StartDay || (StartDay = {}));
var JsEvent = (function () {
    function JsEvent() {
    }
    return JsEvent;
}());
var JsCalendar = (function () {
    function JsCalendar(parentControl) {
        if (parentControl === undefined || parentControl === null) {
            alert("Calendar Control Error: Parent calendar control not found");
        }
        this.parentControl = parentControl;
    }
    JsCalendar.prototype.Generate = function (month, year, startDay) {
        var today = new Date();
        if (year === NaN || year === null || year === undefined) {
            year = today.getFullYear();
        }
        if (month === NaN || month === null || month === undefined) {
            month = today.getMonth();
        }
        if (this.startDay === null || this.startDay === undefined) {
            if (startDay === null || startDay === undefined) {
                startDay = StartDay.Monday;
            }
            this.startDay = startDay;
        }
        this.firstDate = new Date(year, (month), 1);
        this.firstDay = startDay === StartDay.Sunday ? this.firstDate.getDay() + 1 : this.firstDate.getDay();
        this.lastDate = new Date(year, (month + 1), 0, 23, 59, 59);
        this.lastDate = new Date(year, (month + 1), 0);
        this.numDays = this.lastDate.getDate();
        this.parentControl.appendChild(this.generateCalendar());
    };
    JsCalendar.prototype.generateCalendar = function () {
        var self = this;
        while (self.parentControl.firstChild) {
            self.parentControl.removeChild(self.parentControl.firstChild);
        }
        var panel = document.createElement('div');
        panel.className = 'panel panel-default jsCalendar';
        var table = document.createElement('table');
        table.className = 'table table-bordered table-condensed ';
        //Create title row
        var divHeading = document.createElement("div");
        divHeading.className = 'panel-heading';
        var calTitle = document.createElement("div");
        calTitle.innerText = this.monthName(this.firstDate.getMonth()) + ' ' + this.firstDate.getFullYear();
        calTitle.className = 'panel-title text-center';
        var btnPreviousMonth = document.createElement('button');
        btnPreviousMonth.innerHTML = '&nbsp;&lt;&nbsp;';
        btnPreviousMonth.className = 'btn btn-default btn-xs pull-left ';
        btnPreviousMonth.addEventListener('click', function (e) {
            e.preventDefault();
            var myCal = new JsCalendar(self.parentControl);
            myCal.startDay = self.startDay;
            myCal.Generate(self.firstDate.getMonth() - 1, self.firstDate.getFullYear());
        });
        var btnNextMonth = document.createElement('button');
        btnNextMonth.innerHTML = '&nbsp;&gt;&nbsp;';
        btnNextMonth.className = 'btn btn-default btn-xs pull-right';
        btnNextMonth.addEventListener('click', function (e) {
            e.preventDefault();
            var myCal = new JsCalendar(self.parentControl);
            myCal.startDay = self.startDay;
            myCal.Generate(self.firstDate.getMonth() + 1, self.firstDate.getFullYear());
        });
        var btnPreviousYear = document.createElement('button');
        btnPreviousYear.innerHTML = '&nbsp;&lt;&lt;&nbsp;';
        btnPreviousYear.className = 'btn btn-default btn-xs pull-left ';
        btnPreviousYear.addEventListener('click', function (e) {
            e.preventDefault();
            var myCal = new JsCalendar(self.parentControl);
            myCal.startDay = self.startDay;
            myCal.Generate(self.firstDate.getMonth(), self.firstDate.getFullYear() - 1);
        });
        var btnNextYear = document.createElement('button');
        btnNextYear.innerHTML = '&nbsp;&gt;&gt;&nbsp;';
        btnNextYear.className = 'btn btn-default btn-xs pull-right';
        btnNextYear.addEventListener('click', function (e) {
            e.preventDefault();
            var myCal = new JsCalendar(self.parentControl);
            myCal.startDay = self.startDay;
            myCal.Generate(self.firstDate.getMonth(), self.firstDate.getFullYear() + 1);
        });
        divHeading.appendChild(btnPreviousYear);
        divHeading.appendChild(btnPreviousMonth);
        divHeading.appendChild(btnNextYear);
        divHeading.appendChild(btnNextMonth);
        divHeading.appendChild(calTitle);
        panel.appendChild(divHeading);
        var tableHeader = document.createElement('thead');
        //Create header row
        var tableHeaderDaysRow = document.createElement('tr');
        for (var i = 0; i < 7; i++) {
            var dayNameCell = document.createElement("th");
            dayNameCell.innerHTML = this.dayName(this.startDay === StartDay.Sunday ? i : (i + 1 === 7 ? 0 : i + 1));
            tableHeaderDaysRow.appendChild(dayNameCell);
        }
        tableHeader.appendChild(tableHeaderDaysRow);
        table.appendChild(tableHeader);
        //Create body
        var tableBody = document.createElement('tbody');
        var thisDate = this.startDay === StartDay.Sunday ? 0 : 1;
        //Generate rows
        for (var i = 0; i < 6; i++) {
            if (((i - 1) * 7) >= (this.firstDay + this.numDays))
                break;
            var daysRow = document.createElement('tr');
            var usedCells = 0;
            for (var j = 0; j < 7; j++) {
                var dayCell = document.createElement('td');
                if (thisDate > this.numDays + this.firstDay - 1) {
                    dayCell.innerHTML = '<span>&nbsp;</span>';
                    dayCell.className = 'col-md-1 cal-cell disabled-cal-cell text-right';
                }
                else {
                    if (thisDate < this.firstDay) {
                        dayCell.innerHTML = '<span>&nbsp;</span>';
                        dayCell.className = 'col-md-1 cal-cell disabled-cal-cell text-right';
                    }
                    else {
                        dayCell.innerHTML = '<span>' + (thisDate - this.firstDay + 1) + '</span>';
                        if (new Date().getFullYear() === this.firstDate.getFullYear() && new Date().getMonth() === this.firstDate.getMonth() && new Date().getDate() === (thisDate - this.firstDay + 1)) {
                            dayCell.className = 'col-md-1 cal-cell success text-right';
                        }
                        else {
                            dayCell.className = 'col-md-1 cal-cell text-right';
                        }
                        //check for events
                        var events = this.getEvents(new Date(this.firstDate.getFullYear(), this.firstDate.getMonth(), (thisDate - this.firstDay + 1)));
                        console.log(events);
                        if (events.length > 0) {
                            this.addEvents(dayCell, events, new Date(this.firstDate.getFullYear(), this.firstDate.getMonth(), (thisDate - this.firstDay + 1)));
                        }
                        usedCells++;
                    }
                    thisDate++;
                }
                daysRow.appendChild(dayCell);
            }
            if (usedCells > 0) {
                tableBody.appendChild(daysRow);
            }
        }
        table.appendChild(tableBody);
        var panelBody = document.createElement('div');
        panelBody.className = 'panel-body';
        panelBody.appendChild(table);
        panel.appendChild(panelBody);
        return panel;
    };
    JsCalendar.prototype.getEvents = function (dayDate) {
        var thisDate = new Date();
        //read in events for this month here...
        var event1 = new JsEvent();
        event1.eventName = "Test Event 1";
        event1.startDate = new Date(thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate() - 1);
        event1.endDate = new Date(thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate() + 1);
        var event2 = new JsEvent();
        event2.eventName = "Test Event 2";
        event2.startDate = new Date(thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate() - 10);
        event2.endDate = new Date(thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate() - 10);
        var event3 = new JsEvent();
        event3.eventName = "Test Event 3";
        event3.startDate = new Date(thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate() - 1);
        event3.endDate = new Date(thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate() - 1);
        var events = [event1, event2, event3];
        console.log(events);
        //return valid dates for this date
        return events.filter(function (x) { return (new Date(x.startDate.getFullYear(), x.startDate.getMonth(), x.startDate.getDate()).getTime() === dayDate.getTime() ||
            new Date(x.endDate.getFullYear(), x.endDate.getMonth(), x.endDate.getDate()).getTime() === dayDate.getTime()
            || (new Date(x.startDate.getFullYear(), x.startDate.getMonth(), x.startDate.getDate()).getTime() < dayDate.getTime() && new Date(x.endDate.getFullYear(), x.endDate.getMonth(), x.endDate.getDate()).getTime() > dayDate.getTime())); });
    };
    JsCalendar.prototype.addEvents = function (dayCell, events, dayDate) {
        for (var i = 0; i < events.length; i++) {
            var event_1 = events[i];
            var spnEvent = document.createElement('span');
            spnEvent.className = 'event ';
            if (new Date(event_1.startDate.getFullYear(), event_1.startDate.getMonth(), event_1.startDate.getDate()).getTime() !== new Date(event_1.endDate.getFullYear(), event_1.endDate.getMonth(), event_1.endDate.getDate()).getTime()) {
                switch (dayDate.getTime()) {
                    case new Date(event_1.startDate.getFullYear(), event_1.startDate.getMonth(), event_1.startDate.getDate()).getTime():
                        spnEvent.className += 'event-firstday';
                        spnEvent.innerText = event_1.eventName;
                        break;
                    case new Date(event_1.endDate.getFullYear(), event_1.endDate.getMonth(), event_1.endDate.getDate()).getTime():
                        spnEvent.className += 'event-lastday';
                        spnEvent.innerHTML = '&nbsp;';
                        break;
                    default:
                        spnEvent.className += 'event-middleday';
                        spnEvent.innerHTML = '&nbsp;';
                }
            }
            else {
                spnEvent.className += 'event-day';
                spnEvent.innerText = event_1.eventName;
            }
            dayCell.appendChild(spnEvent);
        }
    };
    JsCalendar.prototype.dayName = function (day) {
        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day];
    };
    JsCalendar.prototype.monthName = function (month) {
        return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month];
    };
    return JsCalendar;
}());
window.onload = function () {
    var matchingElements = [];
    var allElements = document.getElementsByTagName('*');
    for (var i = 0, n = allElements.length; i < n; i++) {
        if (allElements[i].getAttribute("jsCalendar") !== null) {
            matchingElements.push(allElements[i]);
        }
    }
    for (var j = 0; j < matchingElements.length; j++) {
        var myCal = new JsCalendar(matchingElements[j]);
        myCal.startDay = StartDay.Sunday;
        myCal.Generate();
    }
};
//# sourceMappingURL=jsCalendar.js.map
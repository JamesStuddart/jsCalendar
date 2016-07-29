enum StartDay {
    Sunday = 1,
    Monday = 2
}

class JsCalendar {
    parentControl: HTMLElement;
    firstDay: number;
    firstDate: Date;
    lastDate: Date;
    numDays: number;
    startDay: StartDay;

    public constructor(parentControl: HTMLElement) {

        if (parentControl === undefined || parentControl === null) {
            alert("Calendar Control Error: Parent calendar control not found");
        }

        this.parentControl = parentControl;
    }

    public Generate();
    public Generate(month: number, year: number);
    public Generate(month: number, year: number, startDay: StartDay);
    public Generate(month?: number, year?: number, startDay?: StartDay) {

        const today = new Date();

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
    }

    private generateCalendar() {
        let self = this;

        while (self.parentControl.firstChild) {
            self.parentControl.removeChild(self.parentControl.firstChild);
        }

        let panel = document.createElement('div');
        panel.className = 'panel panel-default jsCalendar';

        let table = document.createElement('table');
        table.className = 'table table-bordered table-condensed ';

        //Create title row

        let divHeading = document.createElement("div");
        divHeading.className = 'panel-heading';

        let calTitle = document.createElement("div");

        calTitle.innerText = this.monthName(this.firstDate.getMonth()) + ' ' + this.firstDate.getFullYear();
        calTitle.className = 'panel-title text-center';


        let btnPreviousMonth = document.createElement('button');
        btnPreviousMonth.innerHTML = '&nbsp;&lt;&nbsp;';
        btnPreviousMonth.className = 'btn btn-default btn-xs pull-left ';

        btnPreviousMonth.addEventListener('click',
            function (e) {
                e.preventDefault();
                let myCal = new JsCalendar(self.parentControl);
                myCal.startDay = self.startDay;
                myCal.Generate(self.firstDate.getMonth() - 1, self.firstDate.getFullYear());
            });



        let btnNextMonth = document.createElement('button');
        btnNextMonth.innerHTML = '&nbsp;&gt;&nbsp;';
        btnNextMonth.className = 'btn btn-default btn-xs pull-right';

        btnNextMonth.addEventListener('click',
            function (e) {
                e.preventDefault();
                let myCal = new JsCalendar(self.parentControl);
                myCal.startDay = self.startDay;
                myCal.Generate(self.firstDate.getMonth() + 1, self.firstDate.getFullYear());
            });


        let btnPreviousYear = document.createElement('button');
        btnPreviousYear.innerHTML = '&nbsp;&lt;&lt;&nbsp;';
        btnPreviousYear.className = 'btn btn-default btn-xs pull-left ';

        btnPreviousYear.addEventListener('click',
            function (e) {
                e.preventDefault();
                let myCal = new JsCalendar(self.parentControl);
                myCal.startDay = self.startDay;
                myCal.Generate(self.firstDate.getMonth(), self.firstDate.getFullYear() - 1);
            });



        let btnNextYear = document.createElement('button');
        btnNextYear.innerHTML = '&nbsp;&gt;&gt;&nbsp;';
        btnNextYear.className = 'btn btn-default btn-xs pull-right';

        btnNextYear.addEventListener('click',
            function (e) {
                e.preventDefault();
                let myCal = new JsCalendar(self.parentControl);
                myCal.startDay = self.startDay;
                myCal.Generate(self.firstDate.getMonth(), self.firstDate.getFullYear() + 1);
            });



        divHeading.appendChild(btnPreviousYear);
        divHeading.appendChild(btnPreviousMonth);
        divHeading.appendChild(btnNextYear);
        divHeading.appendChild(btnNextMonth);
        divHeading.appendChild(calTitle);
        panel.appendChild(divHeading);

        let tableHeader = document.createElement('thead');

        //Create header row
        let tableHeaderDaysRow = document.createElement('tr');

        for (let i = 0; i < 7; i++) {
            let dayNameCell = document.createElement("th");
            dayNameCell.innerHTML = this.dayName(this.startDay === StartDay.Sunday ? i : (i + 1 === 7 ? 0 : i + 1));
            tableHeaderDaysRow.appendChild(dayNameCell);
        }

        tableHeader.appendChild(tableHeaderDaysRow);

        table.appendChild(tableHeader);

        //Create body
        let tableBody = document.createElement('tbody');

        let thisDate = this.startDay === StartDay.Sunday ? 0 : 1;
        //Generate rows
        for (let i = 0; i < 6; i++) {

            if (((i - 1) * 7) >= (this.firstDay + this.numDays)) break;

            let daysRow = document.createElement('tr');
            let usedCells = 0;
            for (var j = 0; j < 7; j++) {
                let dayCell = document.createElement('td');

                if (thisDate > this.numDays + this.firstDay - 1) {
                    dayCell.innerHTML = '<span>&nbsp;</span>';
                    dayCell.className = 'col-md-1 cal-cell disabled-cal-cell text-right';
                } else {

                    if (thisDate < this.firstDay) {
                        dayCell.innerHTML = '<span>&nbsp;</span>';
                        dayCell.className = 'col-md-1 cal-cell disabled-cal-cell text-right';
                    } else {
                        dayCell.innerHTML = '<span>' + (thisDate - this.firstDay + 1) + '</span>';

                        if (new Date().getFullYear() === this.firstDate.getFullYear() && new Date().getMonth() === this.firstDate.getMonth() && new Date().getDate() === (thisDate - this.firstDay + 1)) {
                            dayCell.className = 'col-md-1 cal-cell success text-right';
                        } else {
                            dayCell.className = 'col-md-1 cal-cell text-right';
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

        let panelBody = document.createElement('div');
        panelBody.className = 'panel-body';

        panelBody.appendChild(table);
        panel.appendChild(panelBody);

        return panel;
    }

    private dayName(day: number) {

        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day];
    }

    private monthName(month: number) {

        return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month];
    }
}


window.onload = () => {
    let matchingElements = [];
    const allElements = document.getElementsByTagName('*');
    for (let i = 0, n = allElements.length; i < n; i++) {
        if (allElements[i].getAttribute("jsCalendar") !== null) {
            matchingElements.push(allElements[i] as HTMLElement);
        }
    }

    for (let j = 0; j < matchingElements.length; j++) {
        var myCal = new JsCalendar(matchingElements[j]);
        myCal.startDay = StartDay.Sunday;
        myCal.Generate();
    }

};
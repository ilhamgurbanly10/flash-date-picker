// flash-date-picker

flashDatePicker();

function flashDatePicker() {

    // main-function
    const datePicker = (picker) => {

        // getting
        const toggler = picker.querySelector('.fl-date-picker-toggler');
        const togglerVal = picker.querySelector('.fl-date-picker-toggler-val');
        const dropdown = picker.querySelector('.fl-date-picker-dropdown');
        const dropdownBox = picker.querySelector('.fl-date-picker-container');
        const close = picker.querySelector('.fl-date-picker-close');
        const days = picker.querySelector('.fl-data-picker-days-container');
        const monthsToggler = picker.querySelector('.fl-date-picker-month-toggler');
        const months = picker.querySelector('.fl-data-picker-months-container');
        const yearsToggler = picker.querySelector('.fl-date-picker-year-toggler');
        const years = picker.querySelector('.fl-data-picker-years-container');
        const input = picker.querySelector('.fl-date-picker-input');
        const resetBtn = picker.querySelector('.fl-date-picker-reset');
        const prevBtn = picker.querySelector('.fl-date-picker-prev');
        const nextBtn = picker.querySelector('.fl-date-picker-next');
        const indexes = ['01','02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        const monthsData = picker.querySelector('.fl-date-picker-data').getAttribute('months').split(",");
        const date = new Date();

        let selectedMonth, selectedDay, selectedYear, defaultSelectedBtn, defaultShownCon,
        containers = [], monthButtons = [], activeButton, yearButtons = [], defaultYearBtn,
        yearIsChanged = false, selectedYear2;

        const thisYear = date.getFullYear();
       
        // functions   
        const toggle = () => { 
            dropdown.classList.toggle('show');
            toggler.classList.toggle('active');
        }  
        
        const hide = () => { 
            dropdown.classList.remove('show');
            toggler.classList.remove('active');
            showDays();
        } 

        const stop = (event) => event.stopPropagation();

        const showMonths = () => {
            months.classList.add('show');
            years.classList.remove('show');
            days.classList.remove('show');
        }

        const showYears = () => {
            years.classList.add('show');
            months.classList.remove('show');
            days.classList.remove('show');
        }

        const showDays = () => {
            days.classList.add('show');
            years.classList.remove('show');
            months.classList.remove('show');
        }

        const setDaysOfWeek = (day) => { 
            const data = picker.querySelector('.fl-date-picker-data').getAttribute('days-of-the-week').split(",");
            const daysOfWeek = picker.querySelector('.fl-date-picker-days-of-week');
            data.forEach(day => daysOfWeek.innerHTML += `<div class="fl-date-picker-day-of-week">${day}</div>`)     
        } 

        const setMonths = (day) => { 
            selectedMonth = getMonth();
            for (let i = 0; i < monthsData.length; i++) { 
                createMonth(monthsData[i], indexes[i], isSelectedMonth(i + 1)); 
            } 
            const thisMonth = date.getMonth();
            monthsToggler.innerHTML = monthsData[thisMonth];        
        } 

        const createMonth = (month, dataIndex, isSelected) => {
            const btn = document.createElement('button');
            btn.className = "fl-date-picker-month fl-date-picker-btn fl-date-picker-grow";
            btn.innerHTML = month;
            btn.setAttribute('type', 'button');
            btn.setAttribute('data-index', dataIndex);
            btn.addEventListener('click', setMonth);
            btn.addEventListener('click', showDays);
            btn.addEventListener('click', activeMonth);
            if (isSelected) btn.classList.add('active');
            months.appendChild(btn);
            monthButtons.push(btn);
        }

        const activeMonth = (event, self) => {
            let monthBtn;
            self ? monthBtn = self : monthBtn =  event.target;
            monthButtons.forEach(btn => btn === monthBtn ? btn.classList.add('active') : btn.classList.remove('active'))  
        }

        const setMonth = (event) => {
            monthsToggler.innerHTML = event.target.innerHTML;
            selectedMonth = event.target.getAttribute('data-index'); 
            const i = getMonthIndex(selectedMonth);
            showCon(i);
            activeBtnByMonthSelection(i);
            setValues();
        }

        activeBtnByMonthSelection = (boxIndex) => {
            const dataIndex = activeButton.getAttribute('data-index');
            let rangeButtons = containers[boxIndex].querySelectorAll('.fl-date-picker-day:not(.out-of-range)');
            const lastBtn = rangeButtons[rangeButtons.length - 1];
            let newBtn = containers[boxIndex].querySelector('.fl-date-picker-day[data-index="'+dataIndex+'"]:not(.out-of-range)');
            if (!newBtn) newBtn = lastBtn;
            else if (newBtn.classList.contains('out-of-range')) newBtn = lastBtn;
            activeBtn(newBtn);
            selectedDay = newBtn.getAttribute('data-index');
            setValues();
        }

        const getMonth = () => indexes[date.getMonth()];

        const setYears = () => {
            const thisYear = date.getFullYear();
            selectedYear = thisYear;
            selectedYear2 = thisYear
            const limit = thisYear + 50;
            for (let i = 1900; i < limit; i++) { createYear(i) }
        }

        const createYear = (year) => {

            const btn = document.createElement('button');
            btn.className = "fl-date-picker-year fl-date-picker-btn fl-date-picker-grow";
            btn.innerHTML = year;  
            btn.setAttribute('type','button');
            btn.setAttribute('data-index', year);
            btn.addEventListener('click', setYear);
            btn.addEventListener('click', showDays);
            btn.addEventListener('click', activeYear);
            btn.addEventListener('click', updateAllDays);
            years.insertBefore(btn, years.children[0]);

            if (year == selectedYear) { 
                btn.classList.add('active');
                defaultYearBtn = btn;
            }  

            yearButtons.push(btn);

        }

        const setYear = (event) => {
            yearsToggler.innerHTML = event.target.innerHTML;
            selectedYear = event.target.getAttribute('data-index'); 
            selectedYear2 = event.target.getAttribute('data-index'); 
            setValues();
        }

        const activeYear = (event, self) => {
            let yearBtn;
            self ? yearBtn = self : yearBtn =  event.target;
            yearButtons.forEach(btn => btn === yearBtn ? btn.classList.add('active') : btn.classList.remove('active'))  
        }

        const getDay = () => {
            const day = date.getDate();
            if (day <= 9) day = "0" + day;
            return day;
        }

        const setDay = () => { selectedDay = getDay() };

        const setToday = () => {
            selectedMonth = getMonth();
            selectedYear = thisYear;
            selectedDay = getDay();
            monthsToggler.innerHTML = monthsData[getMonthIndex(selectedMonth)];
            yearsToggler.innerHTML = selectedYear;
        }

        const setValues = () => { 
            togglerVal.innerHTML = selectedDay + "." + selectedMonth + "." + selectedYear; 
            input.value = selectedYear + "-" + selectedMonth + "-" + selectedDay;
        }

        const reset = () => { 
            setToday(); 
            setValues(); 
            activeBtn(defaultSelectedBtn); 
            showCon(defaultShownCon, true); 
            activeYear(false, defaultYearBtn);
            if (yearIsChanged) updateAllDays(false, defaultYearBtn, thisYear);
            showDays();
        }

        let allMonths = [];

        const getDaysLength = (month, year) => new Date(year, month, 0).getDate();

        const setAllDays = () => {

            date.setFullYear(selectedYear2);
            const year = date.getFullYear();
            
            for (let i = 0; i < 12; i++) {
                allMonths[i] = [];
                const len = getDaysLength(i + 1, year);
                for (let y = 1; y <= len; y++) { allMonths[i].push(y) }  
            }

        }

        const appendAllDays = () => {

            setAllDays();

            for (let i = 0, prevMonth = [], prevMonthIndex, nextMonthIndex, monthIndex, days = []; i < 12; i++) { 
                monthIndex = indexes[i];
                i == 0 ? prevMonthIndex = indexes[11] : prevMonthIndex = indexes[i - 1];
                i == 11 ? nextMonthIndex = indexes[0] : nextMonthIndex = indexes[i + 1];
                i == 0 ? lastDay = allMonths[11][allMonths[11].length - 1] : lastDay = allMonths[i - 1][allMonths[i - 1].length - 1];
                createDays(allMonths[i], lastDay, isSelectedMonth(i + 1), getStartPos(i), monthIndex, prevMonthIndex, nextMonthIndex);
            }

            setDataIndexes();
    
        }

        const updateYear = (btn, defaultYear) => {
            let year;
            if (!btn) btn = defaultYearBtn;
            defaultYear ? year = thisYear : year = btn.getAttribute('data-index');
            year < 1970 ? selectedYear2 = "1970" : selectedYear2 = year;
        }

        const emptyContent = () => {
            containers = [];
            const deletedElement = picker.querySelectorAll('.fl-date-picker-weekly-list-container');
            deletedElement.forEach(el => el.remove());
        }

        const updateAllDays = (event, defaultYearBtn, defaultYear) => {
            yearIsChanged = true;
            updateYear(event.target, defaultYearBtn, defaultYear);
            emptyContent();
            appendAllDays();
        }

        const isSelectedMonth = (i) => {
            if (selectedMonth.startsWith('0')) i = '0' + i;
            return  selectedMonth == i ? true : false;
        } 

        const isSelectedDay = (i) => {
            if (selectedDay[0] == "0") i = '0' + i;
            return selectedDay == i ? true : false;
        }

        const getStartPos = (month) => {
            let day = new Date(`${selectedYear}-${month + 1}-01`).getDay();
            if (day == '0') day = '7';
            return day;
        }

        const createDays = (daysArr, lastDay, shown = false, startPos, monthIndex, prevMonthIndex, nextMonthIndex) => {
            const con = document.createElement('div');
            con.className = "fl-date-picker-weekly-list-container";
            if (shown) con.classList.add('show');
            createWeeklyList(con, daysArr, lastDay, startPos, monthIndex, prevMonthIndex, nextMonthIndex);
            days.appendChild(con);
            containers.push(con);
        }

        const setDataIndexes = () => {

            for (let i = 0; i < containers.length; i++) {

                if (i == 0) { 
                    containers[i].setAttribute('prev-index', '11');
                    containers[i].setAttribute('next-index', '1');
                }   

                else if (i == containers.length - 1) { 
                    containers[i].setAttribute('prev-index', '10');
                    containers[i].setAttribute('next-index', '0');
                } 

                else { 
                    containers[i].setAttribute('prev-index', i - 1);
                    containers[i].setAttribute('next-index', i + 1);
                }  

            }

        }

        const createWeeklyList = (par, days, lastDay, startPos, monthIndex, prevMonthIndex, nextMonthIndex) => {

            let loop = 0, dayIndex = 0, extraDays = 1, addExtraDays = true;

            for (let l = 0, lists = []; l < 6; l++) {

                if (!addExtraDays) return;

                lists[l] = document.createElement('div');
                lists[l].className = "fl-date-picker-weekly-list";
                
                lastDay -= startPos - 1;

                for (let i = 0, buttons = []; i < 7; i++, loop++) {

                    buttons[i] = document.createElement('button');
                    buttons[i].setAttribute('type','button');
                    buttons[i].className = "fl-date-picker-day fl-date-picker-grow";
                    buttons[i].addEventListener('click', selectDay);

                    if (loop + 1 < startPos) {  
                        lastDay += 1;
                        buttons[i].innerHTML = lastDay;
                        buttons[i].setAttribute('data-index', lastDay);
                        buttons[i].setAttribute('month-index', prevMonthIndex);
                        buttons[i].classList.add('out-of-range');
                        buttons[i].classList.add('prev-out-of-range');
                        buttons[i].addEventListener('click', prev);
                    }

                    else if (dayIndex >= days.length) {
                        buttons[i].innerHTML = extraDays;
                        extraDays <= 9 ? buttons[i].setAttribute('data-index', '0' + extraDays) : buttons[i].setAttribute('data-index', extraDays);
                        buttons[i].setAttribute('month-index', nextMonthIndex);
                        buttons[i].classList.add('out-of-range');
                        buttons[i].classList.add('next-out-of-range');
                        buttons[i].addEventListener('click', next);
                        extraDays++;
                        addExtraDays = false;
                    }

                    else {
                        buttons[i].innerHTML = days[dayIndex];
                        dayIndex < 9 ? buttons[i].setAttribute('data-index', '0' + Number(dayIndex + 1)) : buttons[i].setAttribute('data-index', Number(dayIndex + 1));
                        buttons[i].setAttribute('month-index', monthIndex);
                        dayIndex++;
                        if (dayIndex >= days.length) addExtraDays = false;
                    }
                    
                    if (monthIndex == selectedMonth && isSelectedDay(dayIndex)) { 
                        buttons[i].classList.add('active');
                        defaultSelectedBtn = buttons[i];
                        activeButton = buttons[i];
                        defaultShownCon = par;
                    }   
                    
                    lists[l].appendChild(buttons[i]);  

                }

                par.appendChild(lists[l]);

            }         

        }

        const getMonthIndex = (i) => i[0] == '0' ? i =  i[1] - 1 : i - 1;

        const selectDay = (event) => {

            const monthIndex = event.target.getAttribute('month-index');
            monthsToggler.innerHTML = monthsData[getMonthIndex(monthIndex)];
            selectedMonth = monthIndex;
            selectedDay = event.target.getAttribute('data-index'); 
            
            activeBtn(event.target);
            
            setValues();
            hide();

        }

        const activeBtn = (thisBtn) => {
            activeButton = thisBtn;
            const buttons = document.querySelectorAll('.fl-date-picker-day');
            buttons.forEach(btn => btn === thisBtn ? btn.classList.add('active') : btn.classList.remove('active') );
        }

        const prev = () => {
            const prevIndex = picker.querySelector('.fl-date-picker-weekly-list-container.show').getAttribute('prev-index');
            showCon(prevIndex);
            showDays();
        }

        const next = () => {
            const nextIndex = picker.querySelector('.fl-date-picker-weekly-list-container.show').getAttribute('next-index');
            showCon(nextIndex);
            showDays();
        }

        const showCon = (i, self = false) => {
            let selectedCon;
            self ? selectedCon = i : selectedCon = containers[i];
            containers.forEach(con => con === selectedCon ? con.classList.add('show') : con.classList.remove('show') );
            if (!self) { monthButtons[i].click(); };
        }

        // events
        document.addEventListener('click', hide);
        toggler.addEventListener('click', toggle);
        toggler.addEventListener('click', stop);
        dropdown.addEventListener('click', hide);
        dropdownBox.addEventListener('click', stop);
        close.addEventListener('click', hide);
        monthsToggler.addEventListener('click', showMonths);
        yearsToggler.addEventListener('click', showYears);
        resetBtn.addEventListener('click', reset);
        prevBtn.addEventListener('click', prev);
        nextBtn.addEventListener('click', next);

        // calling
        setMonths();
        setDaysOfWeek();
        setYears();
        setDay();
        setValues();
        appendAllDays();
        
    }

    // adding-main-events
    const datePickers = document.querySelectorAll('.fl-date-picker');
    datePickers.forEach(picker => datePicker(picker))

}

// the-end-of-flash-date-picker
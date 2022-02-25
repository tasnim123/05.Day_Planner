const currentDayPara = $('#currentDay');
const container = $('.container');

const curTimeM = moment();
let dailyPlannerLS = JSON.parse(localStorage.getItem('daily-planner')) || [];

const fillCurrentDay = () => {
  const monthName = curTimeM.format('MMMM');
  const weekdayName = curTimeM.format('dddd');
  const dayTh = curTimeM.format('Do');
  currentDayPara.text(`${weekdayName}, ${monthName} ${dayTh}`);
}

const saveEventIntoLS = e => {
  const dateStr = $(e.target).closest('.time-block').attr('data-date-str');
  const timeStr = $(e.target).closest('.time-block').attr('data-time-str');
  const event = $(e.target).closest('.time-block').find('textarea').val().trim();
 
  const existingEventIdx = dailyPlannerLS.findIndex(item => item.dateStr == dateStr && item.timeStr == timeStr);

  if(event == '') {
    dailyPlannerLS = dailyPlannerLS.filter((item, idx) => idx != existingEventIdx);
  } else if(existingEventIdx != -1) {
    dailyPlannerLS = dailyPlannerLS.map((item, idx) => {
      if(idx != existingEventIdx) return item;
      return { ...item, event };
    });
  } else {
    dailyPlannerLS = dailyPlannerLS.concat({ dateStr, timeStr, event });
  }

  localStorage.setItem('daily-planner', JSON.stringify(dailyPlannerLS));
}

const fillTimeblocks = () => {
  let curBusinessTime = moment().set({ 'hour': 9, 'minute': 0, 'seconds': 0 });

  while(curBusinessTime.get('hour') <= 17) {
    const dateStr = curBusinessTime.format('YYYY-MM-DD');
    const timeStr = curBusinessTime.format('hA');
    let textareaClass; 
    
    if(curBusinessTime.get('hour') == curTimeM.get('hour')) textareaClass = 'present';
    else if(curBusinessTime.get('x') > curTimeM.get('x')) textareaClass = 'future';
    else textareaClass = 'past';

    const existingEventItem = dailyPlannerLS.find(item => item.dateStr == dateStr && item.timeStr == timeStr);
    const actualExistingEvent = existingEventItem ? existingEventItem.event : '';

    container.append(`<div class="time-block" data-date-str="${dateStr}" data-time-str="${timeStr}">
      <div class="row">
        <div class="hour p-2">${timeStr}</div>
        <textarea class="${textareaClass}" value="${actualExistingEvent}">${actualExistingEvent}</textarea>
        <button class="saveBtn d-flex justify-content-center align-items-center" onclick="saveEventIntoLS(event)">
          <i class="fas fa-save"></i>
        </button>
      </div>
    </div>`);

    curBusinessTime = curBusinessTime.add(1, 'hour');
  }
}

fillCurrentDay();
fillTimeblocks();
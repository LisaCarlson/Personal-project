$(document).ready(function() {

var date = $('body').attr('data-date');

  populateFeedings();
  populateSleeps();
  populateNotes();
  populateDiapers();

  function populateFeedings() {
    $.getJSON('/users/feedings', function(data) {
      renderFeedings(data); 
    });
  };

  function populateDiapers() {
    $.getJSON('/users/diapers', function(data) {
      renderDiapers(data); 
    });
  };

  
  function populateSleeps() {
    $.getJSON('/users/sleeps', function(data) {
      renderSleeps(data); 
    });
  };
 
  function populateNotes() {
    $.getJSON('/users/notes', function(data) {
     renderNotes(data);
    });
  }
  
  function renderFeedings(collection) {
    var tbody = $('#feedings table tbody');
    tbody.html('');
    for(var x in collection){
      var feeding = collection[x];
      var time = feeding.time;
      var minutes = feeding.minutes;
      var ounces = feeding.ounces;
      var tableContent = '<tr class="feeding">';
      tableContent += '<td><div id="update-time" class="bfh-timepicker time" data-type="feeding" data-id="' + feeding._id + '" data-time="'+ time +'"></div></td>';
      tableContent += '<td><input type="text" class="form-control bfh-number minutes feeding-number" data-type="feeding" data-id="' + feeding._id + '" value="'+ minutes +'"></td>';
      tableContent += '<td><input type="text" class="form-control bfh-number ounces feeding-number" data-type="feeding" data-id="' + feeding._id + '" value="'+ ounces +'"></td>';
      tableContent += '<td><a href="#" class="delete linkdeletefeeding btn btn-default data-toggle="modal" data-target="#deleteFeedModal" rel="' + feeding._id + '"><i class="glyphicon glyphicon-trash"></i></a></td>';
      tableContent += '</tr>';
      tbody.append(tableContent);
    }
    var editRow = '';
    editRow += '<tr class="success feeding">';
    editRow += '<td><div id="new-time" class="bfh-timepicker time" data-type="feeding" data-mode="12h"></div></td>';
    editRow += '<td><input id="new-minutes" type="text" class="form-control bfh-number minutes feeding-number" data-type="feeding"></td>'
    editRow += '<td><input id="new-ounces" type="text" class="form-control bfh-number ounces feeding-number" data-type="feeding"></td>';
    editRow += '<td></td>';
    editRow += '</tr>';
    tbody.append(editRow);
    initTimePickers();
  };

  function renderSleeps(collection) {
    var tbody = $('#sleep table tbody');
    tbody.html('');
    for(var x in collection){
      var sleep = collection[x];
      var asleep = sleep.asleep;
      var awake = sleep.awake;
      var tableContent = '<tr class="sleep">';
      tableContent += '<td><div class="asleep bfh-timepicker" data-type="sleep" data-mode="12h" data-id="' + sleep._id + '" data-time="' + asleep + '"></div></td>';
      tableContent += '<td><div class="awake bfh-timepicker" data-type="sleep" data-mode="12h" data-id="' + sleep._id + '" data-time="' + awake + '"></div></td>';
      tableContent += '<td class="duration">' + calcDuration(asleep, awake) + '</td>';
      tableContent += '<td><a href="#" class="delete linkdeletesleep btn btn-default data-toggle="modal" data-target="#deleteSleepModal" rel="' + sleep._id + '"><i class="glyphicon glyphicon-trash"></i></a></td>';
      tableContent += '</tr>';
      tbody.append(tableContent);
    }
    var editRow = '';
    editRow += '<tr class="success sleep">';
    editRow += '<td><div id="new-asleep" class="asleep bfh-timepicker" data-type="sleep" data-mode="12h"></div></td>';
    editRow += '<td><div id="new-awake" class="awake bfh-timepicker" data-type="sleep" data-mode="12h"></div></td>';
    editRow += '<td class="duration"></td>';
    editRow += '<td></td>';
    editRow += '</tr>';
    tbody.append(editRow);
    initTimePickers();
  }

  function renderDiapers(data) {
    var wetDiaper = $('#wet-diaper'); 
    var dirtyDiaper = $('#dirty-diaper'); 
    if(data[0]) {
      wetDiaper.html(data[0].wet); 
      dirtyDiaper.html(data[0].dirty);
      $('.diaper').attr('data-id', data[0]._id);
    } 
    else { 
      wetDiaper.html('0');   
      dirtyDiaper.html('0');
    }
  }


  function renderNotes(data) {
    var textarea = $('#notes'); 
    if(data) {
      textarea.html(data.notes);
      textarea.attr('data-id', data._id);
    }
  }

  function initTimePickers() {
    $('.bfh-timepicker').each(function(){
      var time = $(this).data('time');
      if(!time){
        time = '';
      }
      $(this).bfhtimepicker({time:time, placeholder:'HH:MM', mode:'12h'});
      $(this).unbind('hide.bfhtimepicker');
      $(this).on('hide.bfhtimepicker', function(event){
        var type = $(this).data('type');
        if(type == 'sleep'){
          saveSleep(event); 
        }
        else{
          saveFeeding(event); 
        } 
      });
    }); 
    $('.feeding-number').each(function() {
      $(this).bfhnumber();
      $(this).unbind('change');
      $(this).on('change', function(event){
        saveFeeding(event);
      });
    });

  }

  function updateNotes() {
    var noteId = $('#notes').attr('data-id');
    var params = {'notes': $('#notes').val(), 'date': date}
    var type = 'POST';
    var url = '/users/newnotes';
    if (noteId) {
      type = 'PUT';
      url = '/users/notes/' + noteId;
    }
    $.ajax({
      type: type,
      data: params,
      url: url,
      dataType: 'JSON'
    }).done(function(response) {
      if (response.msg === '') {
        renderNotes(response);
      }
      else {
        alert('Error: ' + response.msg);
      }
    });
  }



  function parseMinutes(string) {
    var splitString1 = string.split(' ');
    var timeA = splitString1[0];
    var splitTimeA = timeA.split(':');
    var hoursA = parseInt(splitTimeA[0]);
    var minutesA = parseInt(splitTimeA[1]);
    var totalMinutesA = (hoursA * 60) + minutesA;
    if (splitString1[1] === 'PM' && hoursA < 12) {
      totalMinutesA += 720; //12 * 60 
    }
    return totalMinutesA;
  }

  function formatDuration(minutes) {
    var m = minutes % 60;
    var h = parseInt(minutes/60);
    if (h === 0) {
      return m + ' min'
    }
    else {
      var formatted = h + ':';
      if(m < 10){
        formatted += '0';
      }
      return formatted + m;
    }
  }

  function calcDuration(string1, string2) {
    var duration = '';
    if(string1 && string2 && string1 != '' && string2 != ''){
      var totalMinutesA = parseMinutes(string1);
      var totalMinutesB = parseMinutes(string2);
      if(totalMinutesA > totalMinutesB){
        totalMinutesB += 1440; // 24 * 60  
      }
      duration = formatDuration(totalMinutesB - totalMinutesA);
    }
    return duration;
  }
  
  //initally disable diaper minus button
  if ($('#wet-diaper').html() == '') {
    $('.wet-minus').attr('disabled','disabled');
  }
  if ($('#dirty-diaper').html() == '') {
    $('.dirty-minus').attr('disabled','disabled');
  }

  function checkWetDiapers(wetDiapers) {
    if (wetDiapers === 0) {
      $('.wet-minus').attr('disabled','disabled');
    }
    else if (wetDiapers > 0) {
      $('.wet-minus').removeAttr('disabled');
    }
  }

  function checkDirtyDiapers(dirtyDiapers) {
    if (dirtyDiapers === 0) {
      $('.dirty-minus').attr('disabled','disabled');
    }
    else if (dirtyDiapers > 0) {
      $('.dirty-minus').removeAttr('disabled');
    }
  }
  
  function saveFeeding(event) {
    var elem = $(event.currentTarget);
    var row = elem.closest('tr.feeding');
    var rowId = elem.attr('data-id');
    var time = row.find('.time input').val();
    var minutes = row.find('input.minutes').val();
    var ounces = row.find('input.ounces').val();
    var feeding = {'time': time, 'minutes': minutes, 'ounces': ounces, 'date': date};
    var type = 'POST';
    var url = '/users/newfeeding';

    if (rowId) {
      type = 'PUT';
      url = '/users/feedings/' + rowId;
    }
    $.ajax({
      type: type,
      data: feeding,
      url: url,
      dataType: 'JSON'
    }).done(function(response) {
      if (response.msg === '') {
        populateFeedings();
      }
      else {
        alert('Error: ' + response.msg);
      }
    });
  };

  function deleteFeeding(event) {
      event.preventDefault();
      var elem = $(event.currentTarget);
      var feedId = elem.attr('rel');
        $.ajax({
          type: 'DELETE',
          url: '/users/feedings/' + feedId
        }).done(function( response ) {
          if (response.msg === '') {
          }
          else {
            alert('Error: ' + response.msg);
          }
          populateFeedings();
        });
  };

  function saveSleep(event) {
    var elem = $(event.currentTarget);
    var sleepRow = elem.closest('tr.sleep');
    var sleepId = elem.attr('data-id');
    var asleep = sleepRow.find('.asleep input').val();
    var awake = sleepRow.find('.awake input').val();
    var sleep = {'asleep': asleep, 'awake': awake, 'date': date};
    var type = 'POST';
    var url = '/users/newsleep';

    if (sleepId) {
      type = 'PUT';
      url = '/users/sleeps/' + sleepId;
    }
    $.ajax({
      type: type,
      data: sleep,
      url: url,
      dataType: 'JSON'
    }).done(function(response) {
      if (response.msg === '') {
        console.log(response);
        populateSleeps();
      }
      else {
        alert('Error: ' + response.msg);
      }
    });
  };

  function deleteSleep(event) {
    event.preventDefault();
    var elem = $(event.currentTarget);
    var sleepId = elem.attr('rel');
      $.ajax({
        type: 'DELETE',
        url: '/users/sleeps/' + sleepId
      }).done(function( response ) {
        if (response.msg === '') {
        }
        else {
          alert('Error: ' + response.msg);
        }
        populateSleeps();
      });
  };

  //delete feedings
  $('#feedings table tbody').on('click', 'td a.linkdeletefeeding', function(){
    var feedId= $(this)[0].rel;
    $('#confirm-feed-delete').attr('rel', feedId);
    $('#deleteFeedModal').modal('show');
  });
  //delete sleep
  $('#sleep table tbody').on('click', 'td a.linkdeletesleep', function(){
    var sleepId= $(this)[0].rel;
    $('#confirm-sleep-delete').attr('rel', sleepId);
    $('#deleteSleepModal').modal('show');
  }); 
  //update notes
  $('#notes').on('change', updateNotes)
  //update diapers
  $('.diaper').on('click', function(event){

    event.preventDefault();
    var elem = $(event.currentTarget);
    var diaperId = elem.attr('data-id');
    var diaperWet = $('#wet-diaper').html();
    var diaperDirty = $('#dirty-diaper').html();
    var numberWet = parseInt(diaperWet);
    var numberDirty = parseInt(diaperDirty);
    if($( this ).hasClass( "wet-plus" )) {
      numberWet++;
    }
    if($( this ).hasClass( "wet-minus" )) {
      numberWet--;
    }
    if($( this ).hasClass( "dirty-plus" )) {
      numberDirty++;
    }
    if($( this ).hasClass( "dirty-minus" )) {
      numberDirty--;
    }
    
    checkDirtyDiapers(numberDirty);
    checkWetDiapers(numberWet);

    var diapers = {'wet': numberWet, 'dirty': numberDirty, 'date': date};
    var type = 'POST';
    var url = '/users/newdiapers';

    if (diaperId) {
      type = 'PUT';
      url = '/users/diapers/' + diaperId;
    }
    $.ajax({
      type: type,
      data: diapers,
      url: url,
      dataType: 'JSON'
    }).done(function(response) {
      if (response.msg === '') {
        renderDiapers([response.body]);  
      }
      else {
        alert('Error: ' + response.msg);
      }
    });

  });

$('#confirm-feed-delete').on('click', function(event) {
    deleteFeeding(event);
    $('#deleteFeedModal').modal('hide');       
  });
$('#confirm-sleep-delete').on('click', function(event) {
    deleteSleep(event);
    $('#deleteSleepModal').modal('hide');       
  });

});






$(document).ready(function() {
  const tracksCount = 10;  // number of output tracks
  var response;
  var startIndex;

  $(document).on('click', '.search-icon, .close', function(event) {
    var obj = $(this);
    var container = obj.closest('.search-wrapper');

    if(!container.hasClass('active')){
      container.addClass('active');
      $('#hint').fadeOut(300);
      event.preventDefault();
    }
    else if(container.hasClass('active') && obj.closest('.input-holder').length == 0){
      container.removeClass('active');
      container.find('.search-input').val('');
      $('#hint').hide().html($('<span/>', { text: 'Click on the button above and start the search.'})).fadeIn(300);
    }
  });

  $(document).on('submit', '.search-form', function(event) {
    var obj = $(this);
    var value = obj.find('.search-input').val().trim();

    if(value == '') {
      $('#hint').html($('<span/>', { text: 'Fill in the field.'})).fadeIn(300);
    } 
    else {
      $('#hint').hide();
      setResponse(value);
      if(response.length > 0) {
        startIndex = 0;
        var headingTitle = ["Artist", "Track", "Collection", "Genre"];
        var heading = $('<div/>', {class:  'list-heading clearfix'});

        $.each(headingTitle, function(index, title) {
          heading.append(
            $('<div/>', {class: 'col-3'}).append(
              $('<span/>', {text: title})
            )
          );
        });

        var list = $('<ul/>', {class: 'track-list'});
        var showBtn = $('<button/>', {class: 'show-more', text: 'Show more...'});

        $('.list-wrapper').html('').append(heading).append(list).append(showBtn);
        fillTheList();
      }
      else {
        $('#hint').html($('<span/>', { text: 'Sorry, no matches for your query.'})).fadeIn(300);
      }
    }
    event.preventDefault();
  });

  function setResponse(val) {
    var encodeVal = encodeURIComponent(val);
    var path = "https://itunes.apple.com/search?term="+ encodeVal +"&media=music&entity=song&attribute=artistTerm&limit=200";

    $.ajax({
      url: path,
      dataType : "json",
      async: false,
      success: function(r){
        response = r.results.sort(function(a, b){
          if (a.artistName > b.artistName) return 1;
          if (a.artistName < b.artistName) return -1;
        });
      }
    });
  }

  function fillTheList() {
    var list = $('.track-list');
    var data = response.slice(startIndex, startIndex + tracksCount);

    $.each(data, function(i, track) {
      var duration = parseInt(track.trackTimeMillis / (1000 * 60)) + ":" + parseInt(track.trackTimeMillis / 1000 % 60);
      var trackDetails = 
      '<li>\
        <div class="preview-wrapper clearfix">\
          <div class="thumbnail">\
            <img src="' + track.artworkUrl100 + '" alt="track-thumbnail">\
          </div>\
          <div class="col-3">\
            <span class="artist">' + track.artistName + '</span>\
          </div>\
          <div class="col-3">\
            <span class="track">' + track.trackName + '</span>\
          </div>\
          <div class="col-3">\
            <span class="collection">' + track.collectionName + '</span>\
          </div>\
          <div class="col-3">\
            <span class="genre">' + track.primaryGenreName + '</span>\
          </div>\
          <div id="expand">\
            <span></span>\
            <span></span>\
          </div>\
        </div>\
        <div class="full-info-wrapper clearfix">\
          <div class="track-name">\
            <h2>' + track.artistName + " - " + track.trackName + '<span class="note-icon"></span></h2>\
          </div>\
          <div class="col-6">\
            <ul>\
              <li><span>Collection:</span>' + track.collectionName + '</li>\
              <li><span>Track Count:</span>' + track.trackCount + '</li>\
              <li><span>Price:</span>' + track.collectionPrice + ' USD</li>\
            </ul>\
          </div>\
          <div class="col-6">\
            <ul>\
              <li><span>Track duration:</span>' + duration + ' min</li>\
              <li><span>Track price:</span>' + track.trackPrice + ' USD</li>\
            </ul>\
          </div>\
        </div>\
      </li>'

      list.append(trackDetails);
    });
    if(response.slice(startIndex).length <= 10) {
      $('.show-more').hide();
    } 
    else {
      startIndex += tracksCount;
    }
  }

  $(document).on('click', '.show-more', fillTheList);

  $(document).on('click', '#expand', function() {
    var container = $(this).closest('li');
    var fullInfo = $('.full-info-wrapper');

    $('#expand.open').not($(this)).removeClass('open');
    fullInfo.not(container.find(fullInfo)).slideUp();
    $(this).toggleClass('open');
    container.find(fullInfo).slideToggle();
  });

  var scrollPos = 0, 
  currentPos = 0, 
  prevPos = 0;

  $(window).scroll(function(){
    var st = $(this).scrollTop();

    prevPos = currentPos;
    currentPos = $(this).scrollTop();
    if (prevPos < currentPos && currentPos > 200) {
      $('#scroll').addClass('top');
      $('#scroll').removeClass('down');  
    }
    else if(currentPos < 200){
      $('#scroll').removeClass('top');
    }
  });

  $(document).on('click', '#scroll.top', function(){
    $(this).addClass('down');
    scrollPos = currentPos;
    $('html, body').animate({ scrollTop: 0 }, 800);
  });

  $(document).on('click', '#scroll.down', function(){
    $('html, body').animate({ scrollTop: scrollPos }, 800, function() {
      $('#scroll').removeClass('down');
    });
  });

});



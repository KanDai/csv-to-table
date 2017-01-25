jQuery(function($){

// Setteing Variavle
// ----------------------------------
  var $input             = $('#js-input');
  var $code              = $('#js-code');
  var $output            = $('#js-output');
  var $settingItem       = $('.js-settingItem');
  var $message           = $('#js-message');
  var $trClass           = $('input[name="trClass"]');
  var $firstRowClass     = $('input[name="firstRowClass"]');
  var $secondaryRowClass = $('input[name="secondaryRowClass"]');

  var setting = {
    thRow : false,
    thLine : false,
    indent : "  ",
    tableId : "",
    tableClass : "",
    theadClass : "",
    tbodyClass : "",
    trClass : [],
    trUseCommon : true,
    firstRowClass : [],
    firstRowUseCommon : true,
    secondaryRowClass : [],
    secondaryRowUseCommon : true
  }


// Set Function
// ----------------------------------

  /*
   * 設定を変更
   * @param
   */
  var updateSetting = function(el){

    var name = el.attr('name');
    var type = el.data('type');

    switch ( type ){
      case 'checkbox':
        setting[name] = el.prop('checked');
        break;
      case 'select':
        setting[name] = el.val();
        break;
      case 'text':
        setting[name] = el.val();
        break;
    }

    // console.log(setting);
  };


  /*
   * データ取得
   * @param
   */
  var getInputData = function(){
      var input = $input.val();
      var rows = input.split(/\r\n|\r|\n/);

      for (var i = 0; i < rows.length; i++ ){

        // "で挟まれた文字列を取り出して一時的に保存
        var temp = rows[i].match(/"[^"]+"/g);

        // " で挟まれた文字列をデータ上存在しない文字で置き換えてカンマで分割
        var replacedRow = rows[i].replace(/"[^"]+"/g, String.fromCharCode(0x1a));
        var cells = replacedRow.split(",");

        // 分割されたフィールドに置き換えられた文字列を戻す
        for( var j = 0, k = 0; j < cells.length; j++ ) {
          if ( cells[j] == String.fromCharCode(0x1a) ) {
            cells[j] = temp[k].replace(/^"|"$/, '').replace(/"$/, '');
            k++;
          }
        }

        rows[i] = cells;

      }
      return rows;
  };


  /*
   * HTMLを整形
   * @param
   */
  var buildHtml = function(rows){
      var html = '';

      var tableId = ( setting.tableId !== '' ) ? ' id="' + setting.tableId + '"' : '';
      var tableClass = ( setting.tableClass !== '' ) ? ' class="' + setting.tableClass + '"' : '';
      var theadClass = ( setting.theadClass !== '' ) ? ' class="' + setting.theadClass + '"' : '';
      var tbodyClass = ( setting.tbodyClass !== '' ) ? ' class="' + setting.tbodyClass + '"' : '';
      setting.trClass = $trClass.val().split(',');
      setting.firstRowClass = $firstRowClass.val().split(',');
      setting.secondaryRowClass = $secondaryRowClass.val().split(',');

      // console.log(setting.trClass);
      // console.log(setting.firstRowClass);
      // console.log(setting.secondaryRowClass);


      html += '<table' + tableId + tableClass + '>' + '\r\n';
      html += ( setting.thRow ) ? setting.indent + '<thead' + theadClass + '>' + '\r\n' : setting.indent + '<tbody' + tbodyClass + '>' + '\r\n';

      for ( var i = 0; i < rows.length; i++ ){

        // <tr>のHTML
        if ( setting.trClass[0] !== '' ) {
          if ( setting.trUseCommon ) {
            var trClass = ' class="' + setting.trClass[0] + '"';
          } else if ( setting.trClass[i] ) {
            var trClass = ' class="' + setting.trClass[i] + '"';
          } else {
            var trClass = '';
          }
        } else {
          var trClass = '';
        }
        html += setting.indent + setting.indent + '<tr' + trClass + '>' + '\r\n';

        // 1行分のデータを変数に格納
        // 1行分のデータをループしてHTML組み立て
        var row = rows[i];

        for (var j = 0; j < row.length; j++ ){

            // 1行目のクラス
            if ( setting.firstRowClass[0] !== '' ) {
              if ( setting.firstRowUseCommon ) {
                var firstRowClass = ' class="' + setting.firstRowClass[0] + '"';
              } else if ( setting.firstRowClass[j] ) {
                var firstRowClass = ' class="' + setting.firstRowClass[j] + '"';
              } else {
                var firstRowClass = '';
              }
            } else {
              var firstRowClass = '';
            }

            // 2行目以降のクラス
            if ( setting.secondaryRowClass[0] !== '' ) {
              if ( setting.secondaryRowUseCommon ) {
                var secondaryRowClass = ' class="' + setting.secondaryRowClass[0] + '"';
              } else if ( setting.secondaryRowClass[j] ) {
                var secondaryRowClass = ' class="' + setting.secondaryRowClass[j] + '"';
              } else {
                var secondaryRowClass = '';
              }
            } else {
              var secondaryRowClass = '';
            }

            if ( setting.thRow && i === 0 ) {
                var colStart = '<th' + firstRowClass + '>';
                var colEnd   = '</th>';
            } else if ( i === 0 ) {
                var colStart = ( setting.thLine && j === 0 ) ? '<th' + firstRowClass + '>' : '<td' + firstRowClass + '>';
                var colEnd   = ( setting.thLine && j === 0 ) ? '</th>' : '</td>';
            } else {
                var colStart = ( setting.thLine && j === 0 ) ? '<th' + secondaryRowClass + '>' : '<td' + secondaryRowClass + '>';
                var colEnd   = ( setting.thLine && j === 0 ) ? '</th>' : '</td>';
            }

            html += setting.indent + setting.indent + setting.indent + colStart + row[j] + colEnd + '\r\n';
        }

        html += setting.indent + setting.indent + '</tr>' + '\r\n';

        if ( setting.thRow && i === 0 ) {
          html += setting.indent + '</thead>' + '\r\n';
          html += setting.indent + '<tbody' + tbodyClass + '>' + '\r\n';
        }
      }

      html += setting.indent + '</tbody>' + '\r\n';;
      html += '</table>';

      return html;
   };

  /*
   * CodeViewとHTML結果に出力
   * @param
   */
  var outputCode = function(html){
    $code.text(html);
    $output.html(html);
  };




// Event Listener
// ----------------------------------


$input.on('keyup change', function(){

  var rows = getInputData();

  var html = buildHtml(rows);

  outputCode(html);

});


// 読み込み時にテキストエリアにフォーカスを当てる
$input.focus();

// クリップボードにコピー
var clipboard = new Clipboard('#js-code-clipboard');

clipboard.on('success', function(e) {
    e.clearSelection();

    $message.addClass('is-show');

    setTimeout(function(){
      $message.removeClass('is-show');
    }, 1500);
});


// 設定アイテムが変更された時のイベント
$settingItem.on('keyup change', function(){

  updateSetting($(this));

  var rows = getInputData();
  var html = buildHtml(rows);
  outputCode(html);

});


/*
 * Test Data
 */
// $input.text(
//     'あああああ,いいいいい,"10,000","20,000"' + '\r\n' +
//     'あああああ,いいいいい,"10,000","20,000"' + '\r\n' +
//     'あああああ,いいいいい,"10,000","20,000"' + '\r\n' +
//     'あああああ,いいいいい,"10,000","20,000"'
// ).trigger('change');

// Modal
// ----------------------------------

var $modalArea = $('.js-modalArea');
var $modalTrg  = $('.js-modal-trg');
var $modal     = $('.js-modal');

var showModal = function(target){
    $modalArea.addClass('is-show');
    setTimeout(function(){
      $( target ).addClass('is-show');
    }, 10);

};

var closeModal = function(){
  $modal.removeClass('is-show');
  setTimeout(function(){
    $modalArea.removeClass('is-show');
  }, 500);
};

$modalTrg.on('click', function(ev){
  var target = $(this).attr('href');

  showModal(target);

});

$modalArea.on('click', function(ev){
  closeModal();
});

$modal.on('click', function(ev){
  ev.stopPropagation();
});


});


// @TODO 使い方のモーダル表示
// @TODO クリップボードアイコンにツールチップをつける

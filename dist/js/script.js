jQuery(function($){

// Setteing Variavle
// ----------------------------------
  var $input       = $('#js-input');
  var $code        = $('#js-code');
  var $output      = $('#js-output');
  var $settingItem = $('.js-settingItem');
  var $message     = $('#js-message');

  var setting = {
    thRow : false,
    thLine : false,
    indent : "  ",
    tableId : "",
    tableClass : ""
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

      html += '<table' + tableId + tableClass + '>' + '\r\n';

      for (var i = 0; i < rows.length; i++ ){
        html += setting.indent + '<tr>' + '\r\n';

        var row = rows[i];

        for (var j = 0; j < row.length; j++ ){

            if ( setting.thRow && i === 0 ){
                var colType = 'th';
            } else {
                var colType = ( setting.thLine && j === 0) ? 'th' : 'td';
            }

            html += setting.indent + setting.indent + '<' + colType + '>' + row[j] + '</' + colType + '>' + '\r\n';
        }
        html += setting.indent + '</tr>' + '\r\n';
      }

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


// Test Data
$input.text(
    'あああああ,いいいいい,"10,000","20,000"' + '\r\n' +
    'あああああ,いいいいい,"10,000","20,000"' + '\r\n' +
    'あああああ,いいいいい,"10,000","20,000"' + '\r\n' +
    'あああああ,いいいいい,"10,000","20,000"'
).trigger('change');

});


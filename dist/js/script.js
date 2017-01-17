jQuery(function($){

// Setteing Variavle
// ----------------------------------
  var $input       = $('#js-input');
  var $code        = $('#js-code');
  var $output      = $('#js-output');
  var $settingItem = $('.js-settingItem');

  var setting = {
    thRow : false,
    thLine : false
  }


// Set Function
// ----------------------------------

  /*
   * 設定を変更
   * @param
   */
  var updateSetting = function(el){

    var name = el.attr('name');
    var type = el.attr('type');

    switch ( type ){
      case 'checkbox':
        setting[name] = el.prop('checked');
        break;
    }

    console.log(setting);
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
        html += '<table>' + '\r\n';

        for (var i = 0; i < rows.length; i++ ){
          html += '  <tr>' + '\r\n';

          var row = rows[i];

          var colType = '';

          for (var j = 0; j < row.length; j++ ){

              if ( setting.thRow && i === 0 ){
                  colType = 'th';
              } else {
                  colType = ( setting.thLine && j === 0) ? 'th' : 'td';
              }

              html += '    <' + colType + '>' + row[j] + '</' + colType + '>' + '\r\n';
          }
          html += '  </tr>' + '\r\n';
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

    alert('クリップボードにコピーしました');
    // @TODO
    // コピー完了のフィードバックをアラートじゃなくする
});

// 設定アイテムが変更された時のイベント
$settingItem.on('change', function(){

  updateSetting($(this));

  var rows = getInputData();

  var html = buildHtml(rows);

  outputCode(html);

});


});


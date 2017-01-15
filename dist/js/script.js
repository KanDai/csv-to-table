jQuery(function($){

// Setteing Variavle
// ----------------------------------
  var $input  = $('#js-input')
  var $code   = $('#js-code')
  var $output = $('#js-output')

  var setting = {
    thRow : false,
    thLine : false
  }


// Set Function
// ----------------------------------
  var getSetting = function(){

  };

  // データ取得
  var getInputData = function(){
      var input = $input.val();

      var rows = input.split(/\r\n|\r|\n/);

      for (var i = 0; i < rows.length; i++ ){
        rows[i] = rows[i].split(',');
      }

      return rows;
  }

  var outputCode = function(html){
    $code.text(html);
    $output.html(html);
  };




// Event Listener
// ----------------------------------


$input.on('keyup change', function(){

  var rows = getInputData();

  var html = '';
  html += '<table>' + '\r\n';

  for (var i = 0; i < rows.length; i++ ){
    html += '  <tr>' + '\r\n';

    var row = rows[i];

    var colType = '';

    for (var j = 0; j < row.length; j++ ){

        if ( $('#thRow').prop('checked') && i === 0 ){
            colType = 'th'; 
        } else {
            colType = ( $('#thLine').prop('checked') && j === 0) ? 'th' : 'td';
        }

        html += '    <' + colType + '>' + row[j] + '</' + colType + '>' + '\r\n';
    }
    html += '  </tr>' + '\r\n';
  }

  html += '</table>';

  // console.log(html);
  // console.log(rows);

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


});


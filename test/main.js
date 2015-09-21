var dragFilesUpload = {
  init:function(){
    this.support();
  },
  support:function(){
    if (window.FileReader) {
      return true;
    }else{
      alert('你的浏览器暂时不支持拖拽上传 :( ');
      return false;
    }
  }
}

// getElementById
function $id(id) {
	return document.getElementById(id);
}

function handleFileSelect(evt){
	//阻止默认事件
	evt.stopPropagation();
	evt.preventDefault();

  var files = evt.dataTransfer.files;//
  var output = [];
  for (var i=0,f;f=files[i];i++){
    // output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ', f.size, ' bytes','</li>');
    uploadFile(f);
  }
  // document.getElementById('list').innerHTML = '<ul>'  +output.join('')+'</ul>';
}


//上传文件
function uploadFile(file){
	var xhr = new XMLHttpRequest();

	if (xhr.upload){
		//star upload
		xhr.open("POST", "http://localhost:8081/fs", true);
		xhr.setRequestHeader("FILENAME", file.name);

		// file received/failed
		xhr.onreadystatechange = function() {
				document.getElementById('uploadDiv').innerText = xhr.responseText;
		};

		xhr.send(file);
	}
}

function handleDragEnter(evt){
	this.setAttribute('style', 'background:#f60;');
}

function handleDragOver(evt){
	 evt.stopPropagation();
	 evt.preventDefault();
	 //evt.dataTransfer.dropEffect = 'copy';
}

function handleDragLeave(evt){
	this.setAttribute('style', 'background:#f1f1f1;');
}

var dropZone = document.getElementById('drop_zone');
dropZone.addEventListener('dragenter', handleDragEnter, false);
dropZone.addEventListener('dragover',handleDragOver,false)
dropZone.addEventListener('drop',handleFileSelect,false);
dropZone.addEventListener('dragleave', handleDragLeave, false);


window.onload = function(){
//	dragFilesUpload.init();
//	document.getElementById('files').addEventListener('change',handleFileSelect1,false);
}

from fileinput import filename
import mimetypes
import os
from flask import Flask, render_template, request, send_file, send_from_directory, session
from werkzeug.utils import secure_filename
import logging
import imghdr
logger = logging.getLogger('HELLO WORLD')


app = Flask(__name__)
APP_ROOT = os.path.dirname(os.path.abspath(__file__))
#여기에서 upload 파일 루트 변경해 줘야 한다.
UPLOAD_FOLD = './public'
UPLOAD_FOLDER = os.path.join(APP_ROOT, UPLOAD_FOLD)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# 서버 킬때 기본으로 나오는 부분
@app.route('/')
def hello():
    return 'hello!'
# test communicate
@app.route('/api')
def hellos():
    return {
        "hoal" : "how"
    }



# change image file how much big or not
def validate_image(stream):
    header = stream.read(512)  # 512 bytes should be enough for a header check
    stream.seek(0)  # reset stream pointer
    format = imghdr.what(None, header)
    if not format:
        return None
    return '.' + (format if format != 'jpeg' else 'jpg')

# send upload but must to fix it
@app.route('/uploader', methods = ['GET','POST'])
def uploader_file():
    f = request.files['file']
    f.save(os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(f.filename)))

    return 'file uploaded successfully'

#bring pulic image by list 
@app.route('/bring_data', methods = ['GET'])
def bring_data_image():
    path = "UPLOAD_FOLD"
    files = os.listdir(path)
    newlist = []

    for file in files:
        if file.endswith(".png"):
            newlist.append(file)
        newlist.append(file)
    
    print (newlist)
    return newlist

@app.route('/return_image',methods=['GET','POST'])
def serve_image():
    path = "UPLOAD_FOLD"
    files = os.listdir(path)
    newlist = []
    counter=0
    for file in files:
        counter=counter+1
        if file.endswith(".png"):
            newlist.append(file)
        newlist.append(file)

    counter=counter-1
    print (newlist)
    return send_from_directory(path,newlist[counter])

@app.route('/download')
def downloadFile ():
    #For windows you need to use drive name [ex: F:/Example.pdf]
    path = "/public/08c3d43117adf478.jpg"
    return send_file(path, as_attachment=True)


#api testing data


if __name__ == '__main__':
    app.run(debug=True,port = 5000)





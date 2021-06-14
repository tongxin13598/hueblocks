from PIL import Image
import os
import sys
import shutil
import datetime

print('[][][][][] blox2rgb v0.2 [][][][][]\n')
X = str(input('Welcome! Press Enter to begin or type "X" to have more details... '))



# check if "input" folder exists
if os.path.isdir('./input') == False:
    input('\n[!] Error -- "input" folder not found. \nMake sure its placed in the same folder with this script. \nPress Enter to terminate... ')
    sys.exit()



# get list of all .png files in the "input" folder
listImgFound = [f for f in os.listdir("./input") if f.endswith('.png')]

# check if list is not empty
if listImgFound == []:
    input('\n[!] Error -- no textures found. \nPlease check if all the textures placed DIRECTLY in the "input" folder (not in subfolders) and have ".png" extension. \nPress Enter to terminate... ')
    sys.exit()

print('[i] Found', len(listImgFound), 'textures in the "input" folder')

# create a new empty file
try:
    outputTxt = open('output.js', 'x')
except FileExistsError:
    input('\n[!] Warning -- "output.js" already exists. \nPress Enter to overwrite it... ')

outputTxt = open('output.js', 'w')
outputTxt.write('/* generated at ' + str(datetime.datetime.now()) + ' */\n')
outputTxt.close()

failedImgCnt = 0
# cycle through the images starting from the LAST one until the -1 is reached
i = len(listImgFound) -1
while i >= 0:
    imgName = listImgFound[i]

    # try to open an image
    try:  
        imgProc = Image.open('input/' + imgName)
        if X == "X":
            print('opened "' + imgName + '" --', imgProc.format, imgProc.size, imgProc.mode)

        # resize the image to 1px and save it to the "temp" folder
        imgProc = imgProc.resize((1, 1), Image.ANTIALIAS).convert('RGBA')
        if X == "X":
            print('converted "' + imgName + '" to 1px RGBA temp image')

        # load temp image and take the color of the only pixel from it
        imgTemp = imgProc.load()
        imgColor = imgTemp[0, 0]
        if X == "X":
            print('rgb data of "' + imgName + '" is', str(imgColor[0]) + ', ' + str(imgColor[1]) + ', ' + str(imgColor[2]))

        # save results as a JavaScript arrays
        outputTxt = open('output.js', 'a')
        outputTxt.write('var block' + str(i) + ' = ["' + imgName + '", ' + str(imgColor[0]) + ', ' + str(imgColor[1]) + ', ' + str(imgColor[2]) + '];\n')
        if X == "X":
            print('saved', imgName, 'as "block' + str(i) + '" with colour data ' + str(imgColor[0]) + ', ' + str(imgColor[1]) + ', ' + str(imgColor[2]))

    #skip to the next image if the current one cannot be processed
    except:  
        print('[!] Warning -- "' + imgName + '" cannot be processed.')
        failedImgCnt += 1
        ociphew

    # substract 1 to go to the next image
    i -= 1

outputTxt.write('var blockLen = ' + str(len(listImgFound) -1) + ';\nconsole.log("*beep* output values initialized");')
outputTxt.close()
print('\n[][][][][] Conversion finished --', str(len(listImgFound) -failedImgCnt), '/', str(len(listImgFound)), 'textures converted.')
input('Press Enter to terminate... ')

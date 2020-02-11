var Bmob = require('../../dist/Bmob-1.6.1.min.js');
var that;
Page({

  
  data: {
  
  },

  onLoad: function (options) {
    that = this;
    wx.showLoading({  
      title: '加载中...',
      // mask: true
    })
    var jobId = options.jobId;

    const queryJob = Bmob.Query('job');
    queryJob.get(jobId).then(res => {
      var jobName = res.jobName;
      var city = res.city+'[城市]'; 
      var companyLogo = res.companyLogo;
      var companyName = res.companyName;
      var Immediate = res.Immediate;
      if (Immediate==true){ 
        Immediate='立即入职[是]'
      }
      else{
        Immediate = '立即入职[否]'
      }
      var workTime = '实习'+res.workTime+'起';
      var companyLogoUrl = 'https://bmob-cdn-20509.bmobcloud.com' + companyLogo.slice(36)
      console.log('companyLogoUrl' + companyLogoUrl)
      wx.getImageInfo({
        src: companyLogoUrl,
        success: function (companyLogoUrl) {
          console.log(companyLogoUrl)
          wx.getImageInfo({
            src: 'https://bmob-cdn-20509.bmobcloud.com/2018/07/28/006030904052983e80b3aba3cd5e485f.jpg',
            success: function (ourLogo) {

              wx.getImageInfo({
                src: 'https://bmob-cdn-20509.bmobcloud.com/2018/07/28/c9e947eb40aa8883803c07e5379bdc37.png',
                success: function (cityIcon) {

                  wx.getImageInfo({
                    src: 'https://bmob-cdn-20509.bmobcloud.com/2018/07/28/3e37067e403d559180513ee382017024.png',
                    success: function (timeIcon) {

                      wx.getImageInfo({
                        src: 'https://bmob-cdn-20509.bmobcloud.com/2018/07/28/96a2235d40563aa5809b34c4462347f2.png',
                        success: function (tipIcon) {
                          console.log('qweqwdwqwdqwdqwdwq')
                          var scene = jobId;
                          var path ='pages/details/details';
                          let qrData = { path: path, width: 430, interface: 'b', scene: scene, type: 1}
                          Bmob.generateCode(qrData).then(function (res) {
                            console.log(res);
                            var QRSrc = 'https://bmob-cdn-21786.bmobcloud.com' + res.url.slice(36)
                            console.log('QRSrc' + QRSrc)
                            wx.getImageInfo({
                              src: QRSrc,
                              success: function (QRCode) {


                                const ctx = wx.createCanvasContext('shareCanvas');

                                ctx.fillStyle = "white";
                                ctx.fillRect(0, 0, 357, 385);


                                if (jobName.length < 9||jobName.length == 9){
                                  ctx.setFontSize(24)
                                  ctx.fillStyle = '#3D3D3D';
                                  ctx.fillText(jobName, 18, 45);
                                }
                                else if (jobName.length > 10 || jobName.length == 10){
                                  var jobName1 = jobName.substring(0, 10)
                                  var jobName2 = jobName.slice(10)
                                  ctx.setFontSize(20)
                                  ctx.fillStyle = '#3D3D3D';
                                  ctx.fillText(jobName1, 18, 30);
                                  ctx.fillText(jobName2, 18, 57);
                                }

                              
                                ctx.drawImage(companyLogoUrl.path, 239, 22, 100, 100);
                                ctx.setFontSize(16)
                                ctx.fillStyle = '#3D3D3D';


                                if (companyName.length == 2) {
                                  console.log(companyName.length);
                                  ctx.fillText(companyName, 273, 149);
                                }

                                else if (companyName.length==3){
                                  console.log(companyName.length);
                                  ctx.fillText(companyName, 266, 149);
                                }

                                else if (companyName.length == 4) {
                                  console.log(companyName.length);
                                  ctx.fillText(companyName, 258, 149);
                                }

                                else if (companyName.length == 5) {
                                  console.log(companyName.length);
                                  ctx.fillText(companyName, 250, 149);
                                }

                                else if (companyName.length == 6) {
                                  console.log(companyName.length);
                                  ctx.fillText(companyName, 242, 149);
                                }

                                else if (companyName.length == 7) {
                                  console.log(companyName.length);
                                  ctx.fillText(companyName, 236, 149);
                                }

                                else if (companyName.length == 8) {
                                  console.log(companyName.length);
                                  ctx.fillText(companyName, 228, 149);
                                }

                                ctx.setFontSize(14)
                                ctx.fillStyle = '#8F8F8F';
                                ctx.fillText(city, 37, 91);
                                ctx.drawImage(cityIcon.path, 20, 80, 13, 13);


                                ctx.setFontSize(14)
                                ctx.fillStyle = '#8F8F8F';
                                ctx.fillText(workTime, 37, 121);
                                ctx.drawImage(timeIcon.path, 20, 110, 13, 13);

                                ctx.setFontSize(14)
                                ctx.fillStyle = '#8F8F8F';
                                ctx.fillText(Immediate, 37, 151);
                                ctx.drawImage(tipIcon.path, 20, 140, 13, 13);

                                ctx.setLineDash([3, 2]);
                                ctx.lineWidth = 1;
                                ctx.strokeStyle = '#eeeeee';
                                ctx.beginPath();
                                ctx.moveTo(0, 177);
                                ctx.lineTo(400, 177);
                                ctx.stroke();


                                ctx.drawImage(QRCode.path, 133, 186, 90, 90);


                                ctx.setFontSize(14)
                                ctx.fillStyle = '#8F8F8F';
                                ctx.setTextAlign('center')
                                ctx.fillText('长按识别小程序，查看详情', 179, 300);

                                ctx.setLineDash([3, 2]);
                                ctx.lineWidth = 1;
                                ctx.strokeStyle = '#eeeeee';
                                ctx.beginPath();
                                ctx.moveTo(0, 313);
                                ctx.lineTo(400, 313);
                                ctx.stroke();


                                ctx.drawImage(ourLogo.path, 125, 322, 108, 28);

                                ctx.setFontSize(14)
                                ctx.fillStyle = '#8F8F8F';
                                ctx.setTextAlign('center')
                                ctx.fillText('校招实习租房一站式解决', 179, 373);
                                ctx.draw();
                                wx.hideLoading();
                              }
                            })
                          })    
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
    })
  },

  savePoster:function(){
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      console.log("666")
      wx.canvasToTempFilePath({
        destWidth: 1071,
        destHeight: 1155,
        canvasId: 'shareCanvas',
        success: (res) => {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: (res) => {
              console.log(res);
              wx.hideLoading();
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 2000
              })
              that.setData({
                hadSave: true
              });
            },
            fail: (err) => {
              wx.hideLoading();
              wx.showModal({
                title: '授权失败',
                content: '您之前误点了拒绝授权，请允许授权保存此图片至您的相册',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success(settingdata) {
                        console.log(settingdata)
                        if (settingdata.authSetting.scope.writePhotosAlbum) {

                        } else {

                        }
                      }
                    })
                  }
                }
              })
            }
          })
        }
      })


  }



})
var Bmob = require('../../dist/Bmob-1.6.1.min.js');
var that;
Page({


  data: {

  },


  onLoad: function (options) {
    that = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var houseId = options.houseId; 
    const queryHouse = Bmob.Query('house');
    queryHouse.get(houseId).then(res => {
      var housePic = res.housePic[0];
      housePic = 'https://bmob-cdn-21786.bmobcloud.com' + housePic.slice(36);
      var title = res.title;
      var tenancyType = res.tenancyType;
      var houseType = res.houseType;
      var rentFee = '租金'+res.rentFee+'/月';
      var conmanyLabel = res.conmanyLabel;
      var address = res.address;
      wx.getImageInfo({
        src: housePic,
        success: function (housePic) {
          console.log(housePic)
          wx.getImageInfo({
            src: 'https://bmob-cdn-21786.bmobcloud.com/2018/10/04/bcb5571b406b51c08026c064f7d1176b.png',
            success: function (ourLogo) {
              console.log(ourLogo)

              wx.getImageInfo({
                src: 'https://bmob-cdn-21786.bmobcloud.com/2018/10/04/df84b1e1408334b98044faf023386cae.png',
                success: function (cityIcon) {

                  console.log(cityIcon)
                  var scene = houseId;
                  var path = 'pages/publishdetail/publishdetail';
                  let qrData = { path: path, width: 430, interface: 'b', scene: scene, type: 1 }
                  Bmob.generateCode(qrData).then(function (res) {
                    console.log(res);
                    console.log('6666');
                    var QRSrc = 'https://bmob-cdn-21786.bmobcloud.com' + res.url.slice(36)
                    wx.getImageInfo({
                      src: QRSrc,
                      success: function (QRCode) {


                        const ctx = wx.createCanvasContext('shareCanvas');
                        ctx.fillStyle = "white";
                        ctx.fillRect(0, 0, 357, 385);



                        if (conmanyLabel.length == 0) {

                          ctx.drawImage(housePic.path, 106.5, 15, 144, 108.5);



                          ctx.setFontSize(16)
                          ctx.fillStyle = '#999999';
                          ctx.fillText('房源信息', 18, 190.5);


                          ctx.setFontSize(14)
                          ctx.fillStyle = '#3185ff';
                          ctx.fillText(tenancyType, 116.5, 190.5);

                          ctx.setFontSize(14)
                          ctx.fillStyle = '#3185ff';
                          ctx.fillText(houseType, 176, 190.5);

                          ctx.setFontSize(14)
                          ctx.fillStyle = '#ff4230';
                          ctx.fillText(rentFee, 245, 190.5);


                          ctx.setFontSize(16)
                          ctx.fillStyle = '#999999';
                          ctx.fillText('房源地点', 18, 242);

                          ctx.drawImage(cityIcon.path, 97, 230.5, 13, 13);

                          ctx.setFontSize(14)
                          ctx.fillStyle = '#999999';
                          ctx.fillText(address, 116.5, 242);


                          ctx.setLineDash([3, 2]);
                          ctx.lineWidth = 1;
                          ctx.strokeStyle = '#eeeeee';
                          ctx.beginPath();
                          ctx.moveTo(0, 270);
                          ctx.lineTo(400, 270);
                          ctx.stroke();

                          ctx.drawImage(QRCode.path, 20, 280, 90, 90);
                          ctx.drawImage(ourLogo.path, 170, 290, 128.5, 48.5);

                          ctx.setFontSize(14)
                          ctx.fillStyle = '#8f8f8f';
                          ctx.fillText('长按识别小程序，查看详情', 150, 360);

                          ctx.setFontSize(16)
                          ctx.fillStyle = '#3D3D3D';
                          ctx.setTextAlign('center')


                          if (title.length < 18) {
                            ctx.fillText(title, 179, 160);
                          }
                          else if (title.length > 18) {
                            var title1 = title.substring(0, 18)
                            var title2 = title.slice(18)
                            ctx.fillText(title1, 179, 150);
                            ctx.fillText(title2, 179, 170);
                          }
                        }

                        else if (conmanyLabel.length == 1) {

                          ctx.drawImage(housePic.path, 106.5, 12, 144, 108.5);



                          ctx.setFontSize(16)
                          ctx.fillStyle = '#999999';
                          ctx.fillText('房源信息', 18, 181.5);

                          ctx.setFontSize(14)
                          ctx.fillStyle = '#3185ff';
                          ctx.fillText(tenancyType, 116.5, 181.5);

                          ctx.setFontSize(14)
                          ctx.fillStyle = '#3185ff';
                          ctx.fillText(houseType, 176, 181.5);

                          ctx.setFontSize(14)
                          ctx.fillStyle = '#ff4230';
                          ctx.fillText(rentFee, 245, 181.5);

                          ctx.setFontSize(16)
                          ctx.fillStyle = '#999999';
                          ctx.fillText('适合人群', 18, 216.5);


                          ctx.setFontSize(14)
                          ctx.fillStyle = '#ff662e';
                          ctx.fillText(conmanyLabel[0], 116.5, 216.5);

                          ctx.setFontSize(16)
                          ctx.fillStyle = '#999999';
                          ctx.fillText('房源地点', 18, 252);

                          ctx.drawImage(cityIcon.path, 97, 240.5, 13, 13);

                          ctx.setFontSize(14)
                          ctx.fillStyle = '#999999';
                          ctx.fillText(address, 116.5, 252);

                          ctx.setLineDash([3, 2]);
                          ctx.lineWidth = 1;
                          ctx.strokeStyle = '#eeeeee';
                          ctx.beginPath();
                          ctx.moveTo(0, 270);
                          ctx.lineTo(400, 270);
                          ctx.stroke();

                          ctx.drawImage(QRCode.path, 20, 280, 90, 90);

                          ctx.drawImage(ourLogo.path, 170, 290, 128.5, 48.5);

                          ctx.setFontSize(14)
                          ctx.fillStyle = '#8f8f8f';
                          ctx.fillText('长按识别小程序，查看详情', 150, 360);


                          ctx.setFontSize(16)
                          ctx.fillStyle = '#3D3D3D';
                          ctx.setTextAlign('center')
                          if (title.length < 18) {
                            ctx.fillText(title, 179, 160);
                          }
                          else if (title.length > 18) {
                            var title1 = title.substring(0, 18)
                            var title2 = title.slice(18)
                            ctx.fillText(title1, 179, 143);
                            ctx.fillText(title2, 179, 163);
                          }

                        }
                        else if (conmanyLabel.length == 2) {

                          ctx.drawImage(housePic.path, 106.5, 12, 144, 108.5);



                          ctx.setFontSize(16)
                          ctx.fillStyle = '#999999';
                          ctx.fillText('房源信息', 18, 181.5);

                          ctx.setFontSize(14)
                          ctx.fillStyle = '#3185ff';
                          ctx.fillText(tenancyType, 116.5, 181.5);

                          ctx.setFontSize(14)
                          ctx.fillStyle = '#3185ff';
                          ctx.fillText(houseType, 176, 181.5);

                          ctx.setFontSize(14)
                          ctx.fillStyle = '#ff4230';
                          ctx.fillText(rentFee, 245, 181.5);

                          ctx.setFontSize(16)
                          ctx.fillStyle = '#999999';
                          ctx.fillText('适合人群', 18, 216.5);

                          ctx.setFontSize(14)
                          ctx.fillStyle = '#ff662e';
                          ctx.fillText(conmanyLabel[0], 116.5, 216.5);

                          ctx.setFontSize(14)
                          ctx.fillStyle = '#ff662e';
                          ctx.fillText(conmanyLabel[1], 116.5 + conmanyLabel[0].length * 14 + 25, 216.5);


                          ctx.setFontSize(16)
                          ctx.fillStyle = '#999999';
                          ctx.fillText('房源地点', 18, 252);

                          ctx.drawImage(cityIcon.path, 97, 240.5, 13, 13);

                          ctx.setFontSize(14)
                          ctx.fillStyle = '#999999';
                          ctx.fillText(address, 116.5, 252);

                          ctx.setLineDash([3, 2]);
                          ctx.lineWidth = 1;
                          ctx.strokeStyle = '#eeeeee';
                          ctx.beginPath();
                          ctx.moveTo(0, 270);
                          ctx.lineTo(400, 270);
                          ctx.stroke();

                          ctx.drawImage(QRCode.path, 20, 280, 90, 90);

                          ctx.drawImage(ourLogo.path, 170, 290, 128.5, 48.5);

                          ctx.setFontSize(14)
                          ctx.fillStyle = '#8f8f8f';
                          ctx.fillText('长按识别小程序，查看详情', 150, 360);


                          ctx.setFontSize(16)
                          ctx.fillStyle = '#3D3D3D';
                          ctx.setTextAlign('center')
                          if (title.length < 18) {
                            ctx.fillText(title, 179, 160);
                          }
                          else if (title.length > 18) {
                            var title1 = title.substring(0, 18)
                            var title2 = title.slice(18)
                            ctx.fillText(title1, 179, 143);
                            ctx.fillText(title2, 179, 163);
                          }

                        }

                        else if (conmanyLabel.length == 3) {

                          ctx.drawImage(housePic.path, 106.5, 12, 144, 108.5);



                          ctx.setFontSize(16)
                          ctx.fillStyle = '#999999';
                          ctx.fillText('房源信息', 18, 181.5);

                          ctx.setFontSize(14)
                          ctx.fillStyle = '#3185ff';
                          ctx.fillText(tenancyType, 116.5, 181.5);

                          ctx.setFontSize(14)
                          ctx.fillStyle = '#3185ff';
                          ctx.fillText(houseType, 176, 181.5);

                          ctx.setFontSize(14)
                          ctx.fillStyle = '#ff4230';
                          ctx.fillText(rentFee, 245, 181.5);

                          ctx.setFontSize(16)
                          ctx.fillStyle = '#999999';
                          ctx.fillText('适合人群', 18, 216.5);

                          ctx.setFontSize(14)
                          ctx.fillStyle = '#ff662e';
                          ctx.fillText(conmanyLabel[0], 116.5, 216.5);

                          ctx.setFontSize(14)
                          ctx.fillStyle = '#ff662e';
                          ctx.fillText(conmanyLabel[1], 116.5 + conmanyLabel[0].length * 14 + 25, 216.5);

                          ctx.setFontSize(14)
                          ctx.fillStyle = '#ff662e';
                          ctx.fillText(conmanyLabel[2], 116.5 + conmanyLabel[0].length * 14 + conmanyLabel[1].length * 14 + 50, 216.5);


                          ctx.setFontSize(16)
                          ctx.fillStyle = '#999999';
                          ctx.fillText('房源地点', 18, 252);

                          ctx.drawImage(cityIcon.path, 97, 240.5, 13, 13);

                          ctx.setFontSize(14)
                          ctx.fillStyle = '#999999';
                          ctx.fillText(address, 116.5, 252);

                          ctx.setLineDash([3, 2]);
                          ctx.lineWidth = 1;
                          ctx.strokeStyle = '#eeeeee';
                          ctx.beginPath();
                          ctx.moveTo(0, 270);
                          ctx.lineTo(400, 270);
                          ctx.stroke();

                          ctx.drawImage(QRCode.path, 20, 280, 90, 90);

                          ctx.drawImage(ourLogo.path, 170, 290, 128.5, 48.5);

                          ctx.setFontSize(14)
                          ctx.fillStyle = '#8f8f8f';
                          ctx.fillText('长按识别小程序，查看详情', 150, 360);


                          ctx.setFontSize(16)
                          ctx.fillStyle = '#3D3D3D';
                          ctx.setTextAlign('center')
                          if (title.length < 18) {
                            ctx.fillText(title, 179, 160);
                          }
                          else if (title.length > 18) {
                            var title1 = title.substring(0, 18)
                            var title2 = title.slice(18)
                            ctx.fillText(title1, 179, 143);
                            ctx.fillText(title2, 179, 163);
                          }



                        }





                        ctx.draw();
                        wx.hideLoading();
                      }
                    })
                  }).catch(function (err) {
                    console.log(err);
                  });


            


      
                }
              })


            }
          })
        }
      })



    })

  },

  savePoster: function () {
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
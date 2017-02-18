import api from '../../utils/api'

Page({
  data:{
    songRec: []
  },
  onLoad:function(){
    // 页面初始化 options为页面跳转所带来的参数
    this.getPlayList();
    this.getNetInfo();
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  getPlayList: function () {
    wx.request({
      url: api.apiUrl.host + api.apiUrl.playlist || '',
      method: 'GET',
      data: {
        id: api.setting.hotlistid
      },
      success: (res) => {
        let rec = []
        let that = this
        let songlist = res.data.result.tracks;
        let code = res.data.code
        let title,author,album,album_title,song_id;
        if (code == 200) {
          for (let i=0,len=10;i<len;i++) {
            title = songlist[i].name;
            author = songlist[i].artists[0].name;
            album = songlist[i].album.picUrl;
            album_title = songlist[i].album.name;
            song_id = songlist[i].id;
            rec.push({
              "title":title,
              "author":author,
              "album":album,
              "album_title":album_title,
              "song_id":song_id
            })
          }
          that.setData({
            songRec: rec
          })
        }
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },
  playSong: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../player/player?id=' + id
    })
  },
  getNetInfo: function () {
    wx.getNetworkType({
      success: (e) => {
        var type = e.networkType
        if (type != 'wifi') {
          wx.showModal({
            content: '您正在使用' + type + '网络。请注意流量。',
            confirmText: '知道了',
            confirmColor: '#D81E06',
            showCancel: false
          })
        }
      }
    })
  }
})

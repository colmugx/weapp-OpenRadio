import api from '../../utils/api'

Page({
  data:{
    ctrl: "音乐控制区域",
    cpTime: '00:00',
    duration: '00:00'
  },
  onLoad:function(param) {
    // 页面初始化 options为页面跳转所带来的参数
    let id = param.id
    this.getSong(id)
    this.getLrc(id)
  },
  onReady:function(){
    // 页面渲染完成
    this.getSongStatus()
    let songName = this.data.songName
      wx.setNavigationBarTitle({
          title: songName ? '正在播放 - ' + songName : 'OpenRadio Player'
    })
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
    wx.pauseBackgroundAudio();
  },
  onUnload:function(){
    // 页面关闭
  },
  getSong:function(id) {
    let that = this
    wx.request({
      url: api.apiUrl.host + api.apiUrl.song || '',
      method: 'GET',
      data: {
        id: id,
        ids: [id]
      },
      success: (res) => {
        let songUrl = res.data.songs[0].mp3Url
        let song_info = res.data.songs[0]
        let album_big = song_info.album.blurPicUrl
        let album_small = song_info.album.picUrl
        let name = song_info.name
        let author = song_info.artists[0].name
        that.setData({
          nowPlay: songUrl,
          songAuthor: author,
          songName: name,
          album: album_big
        })
        wx.playBackgroundAudio({
          dataUrl: songUrl,
          title: name
        })
      }
    })
  },
  getLrc: function (id) {
    wx.request({
      url: api.apiUrl.host + api.apiUrl.lrc || '',
      method: 'GET',
      data: {
        id: id,
        lv: -1
      },
      success: (res) => {
        // let strFot = /\[(\d{2}:\d{2})\.\d{2,}\](.*)/
        let that = this
        let lrc = res.data.lrc.lyric
        if (!lrc) {
          console.log(lrc)

        }else {
          let lrcArr = lrc.split('\n')
          console.log(lrcArr)
          that.setData({
            lrcArr: lrcArr
          })
        }
      }
    })
  },
  getSongStatus: function () {
    let that = this
    setInterval(() => {
      wx.getBackgroundAudioPlayerState({
        success: (res) => {
          let status = res.status
          let currentPosition = res.currentPosition
          let duration = res.duration
          if (status === 1) {
            that.setData({
              cpTime: this.formatTime(currentPosition),
              duration: this.formatTime(duration),
              musicPg: ((currentPosition / duration) * 100)
            })
          }
        }
      })
   }, 1000);
  },
  clickPlay:function() {
    let that = this
    var play = that.data.status === 'pause' ? 'play' : 'pause'
    that.setData({
      status: play
    })
    wx.getBackgroundAudioPlayerState({
      success: (e) => {
        let s = e.status
        switch (s) {
          case 0:

            break;
          case 1:
            wx.pauseBackgroundAudio()
            break;
          default:
            break;
        }
      }
    })
  },
  formatTime:(time) => {
		time = Math.floor(time);
		var m = Math.floor(time / 60).toString();
		m = m.length < 2 ? '0' + m : m;
		var s = (time - parseInt(m) * 60).toString();
		s = s.length < 2 ? '0' + s : s;
		return m + ':' + s;
	}
})

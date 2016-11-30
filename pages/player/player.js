import api from '../../utils/api'

Page({
  data:{
    ctrl: "音乐控制区域",
    cpTime: '00:00'
  },
  onLoad:function(param){
    // 页面初始化 options为页面跳转所带来的参数
    let id = param.id
    this.getSong(id)
  },
  onReady:function(){
    // 页面渲染完成
    this.getSongStatus()
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
  getSong: function(id) {
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
        wx.setNavigationBarTitle({
			    title: '正在播放 - ' + name
		    });
      }
    })
  },
  getSongStatus: function () {
    let that = this
    wx.getBackgroundAudioPlayerState({
      success: (res) => {
        let status = res.status
        let duration = res.duration
        if (status === 1) {
          that.setData({
            duration: this.formatTime(duration),
          })
        }
      }
    })
    setInterval(() => {
      wx.getBackgroundAudioPlayerState({
        success: (res) => {
          let currentPosition = res.currentPosition
          let duration = res.duration
          that.setData({
            cpTime: this.formatTime(currentPosition),
            musicPg: ((currentPosition / duration) * 100)
          })
          if (currentPosition === duration) {
            wx.stopBackgroundAudio();
          }
        }
      })
		}, 1000);

  },
  clickPlay: function () {
    var status = 'play'

  },
  formatTime: function(time) {
		time = Math.floor(time);
		var m = Math.floor(time / 60).toString();
		m = m.length < 2 ? '0' + m : m;
		var s = (time - parseInt(m) * 60).toString();
		s = s.length < 2 ? '0' + s : s;
		return `${m}:${s}`;
	}
})

//歌曲接口重构
const apiUrl = {
    host: "http://music.163.com/api/",
    playlist: "playlist/detail/",
    song: "song/detail/",
    lrc: "song/lyric/"
}
//总觉得日后有各种列表…
const kindsList = {
    // hotlistid: '554473977'
    hotlistid: '3778678'
}
//广播个接口尝试一下
var wId = 0

//方法封装，page那边太乱了…
const wxRequest = (p, u) => {
    wx.request({
        url: u,
        header: {
            'Content-Type': 'application/json'
        },
        data: p.data || {id: kindsList.hotlistid},  //为了简洁命都不要系列…
        method: 'GET',
        success: (res) => {
            p.success && p.success(res)
        },
        fail: (err) => {
            console.log(err)
        }
    })
}

const playCtrl = {
    getState: (p) => wx.getBackgroundAudioPlayerState({
        success: (res) => {
            p.success && p.success(res)
        }
    }),
    pause: () => wx.pauseBackgroundAudio(),
    play: (p) => wx.playBackgroundAudio({
        dataUrl: p.url,
        title: p.title
    })
}

const request = {
    lrc: (params) => wxRequest(params, apiUrl.host + apiUrl.lrc),
    music: (params) => wxRequest(params, apiUrl.host + apiUrl.song),
    hotList: (params) => {wx.showToast({title: 'Loading..', icon: 'loading'}), wxRequest(params, apiUrl.host + apiUrl.playlist)}}

const netType = (m) => wx.getNetworkType({
    success: (res) => {
        m.success && m.success(res)
    }
})

module.exports = {
    apiUrl,
    kindsList,
    request,
    playCtrl,
    netType,
    wId
}

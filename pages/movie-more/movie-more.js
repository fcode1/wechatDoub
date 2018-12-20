// pages/movie-more/movie-more.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showInTheater: true,
        showComingSoon: false,
        inTheater: {},
        comingSoon: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options)
        var typeId = options.typeId
        if (typeId == 'inTheater') {
            this.setData({ showInTheater: true, showComingSoon: false })
        } else {
            this.setData({ showInTheater: false, showComingSoon: true })
        }
        this.getMovieListData(typeId);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    getMovieListData(typeId) {
        let url;
        if (typeId == 'inTheater') {
            url = app.globalData.doubanBase + app.globalData.inTheater;
        } else {
            url = app.globalData.doubanBase + app.globalData.comingSoon;
        }
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })

        //切换按钮获取不同数据
        var offset = this.data[typeId].offset || 0;
        var total = this.data[typeId].total || 999;
        if (offset >= total) {
            return;
        }

        wx.request({
            url,
            type: 'GET',
            header: { 'content-type': 'json' },
            data: {
                start: offset,
                count: 5
            },
            success: res => {
                console.log(res);
                var subjects = res.data.subjects;
                var movies = this.data[typeId].movies || [];
                var total = res.data.total;
                var offset = this.data[typeId].offset || 0;
                offset += subjects.length;

                subjects.forEach(item => {
                    let allCasts = item.casts.map(i => i.name).join('/');
                    let allDirs = item.directors.map(i => i.name).join('/');
                    let allGenres = item.genres.join('/');
                    let movie = {
                        ...item,
                        allCasts,
                        allDirs,
                        allGenres,
                        typeId
                    }
                    movies.push(movie);
                })
                this.setData({
                    [typeId]: { offset, total, movies }
                })
            },
            fail: err => console.log(err),
            complete() {
                wx.hideToast();
            }
        })
    },
    selectTab(e) {
        var tabId = e.currentTarget.dataset.tabId;
        if (tabId == 'inTheater') {
            this.setData({ showInTheater: true, showComingSoon: false })
        } else {
            this.setData({ showInTheater: false, showComingSoon: true })
        }

        if (!this.data[tabId].movies) {
            this.getMovieListData(tabId);
        }
    },
    loadMore() {
        console.log(11)
        var typeId
        if (this.data.showInTheater) {
            typeId = 'inTheater'
        } else {
            typeId = 'comingSoon'
        }
        this.getMovieListData(typeId);
    },
    handleTicket() {
        wx.showModal({
            title: '提示',
            content: '用户点击购票',
            success(res) {
                console.log(res);
            },
            fail(err) {
                console.log(err);
            }
        })
    },
    handleWish() {
        wx.showModal({
            title: '提示',
            content: '那就去看吧'
        })
    }
})
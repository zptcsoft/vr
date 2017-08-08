module.exports =  {
    'createtutorialid':  function (title, sectionid) {
        title = title.replace(/\s/g, '-').toLowerCase();
        return 'tutorial-' + title + '-' + sectionid;
    }
};

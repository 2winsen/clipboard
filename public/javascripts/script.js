$(function () {
    const createCodeMirror = (value) => {
        const EDITOR_DEBOUNNCE = 3000
        return CodeMirror($('#editor-pane').get(0), {
            lineNumbers: true,
            styleActiveLine: true,
            value: value,
        })
            .on('change', _.debounce((codeMirror, changeObj) => {
                const payload = {
                    text: codeMirror.getValue()
                }
                $.post('/editor', payload)
                    .fail(function (err) {
                        throw new Error(err)
                        $errorPanel.show()
                    })
            }, EDITOR_DEBOUNNCE, { trailing: true }))
    }

    const splitPane = () => {
        Split(['#editor-pane', '#upload-pane'], {
            sizes: [75, 25],
            direction: 'vertical',
            gutterSize: 8
        })        
    }

    const init = () => {
        splitPane()
        $.get('/editor')
            .done(function (value) {
                let cm = createCodeMirror(value)
            })
            .fail(function (err) {
                throw new Error(err)
                $errorPanel.show()
            })
    }

    init()

})
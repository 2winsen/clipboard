$(() => {
    const createCodeMirror = (value) => {
        const EDITOR_DEBOUNNCE = 3000
        let codeMirror = CodeMirror($('#editor-pane').get(0), {
            lineNumbers: true,
            styleActiveLine: true,
            value: value,
            lineWrapping : true
        })
        codeMirror.on('change', _.debounce((codeMirror, changeObj) => {
            const payload = {
                text: codeMirror.getValue()
            }
            if (changeObj.origin !== 'setValue') {
                $.post('/editor', payload)
                    .fail((err) => {
                        throw new Error(err)
                        $errorPanel.show()
                    })
            }
        }, EDITOR_DEBOUNNCE, { trailing: true }))
        return codeMirror
    }

    const splitPane = () => {
        Split(['#editor-pane', '#upload-pane'], {
            sizes: [75, 25],
            direction: 'vertical',
            gutterSize: 8
        })
    }

    const connectWs = (codeMirror, port) => {
        var ws = new WebSocket(`ws://${window.document.location.host}`)
        ws.onmessage = (event) => codeMirror.setValue(event.data)
    }

    const init = () => {
        splitPane()
        $.get('/editor')
            .done((res) => {
                let codeMirror = createCodeMirror(res.text)
                connectWs(codeMirror, res.wsPort)
            })
            .fail((err) => {
                throw new Error(err)
                $errorPanel.show()
            })
    }

    init()
})
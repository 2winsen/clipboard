$(() => {
  const $errorPanel = $('#error-panel')

  const xhrFailHandler = (err) => {
    $errorPanel.show()
    throw new Error(`XHR request failed with status text - ${err.statusText}`)
  }

  const createCodeMirror = (value) => {
    const EDITOR_DEBOUNCE = 1500
    let codeMirror = CodeMirror($('#editor-pane').get(0), {
      lineNumbers: true,
      styleActiveLine: true,
      value: value,
      lineWrapping: true
    })
    codeMirror.on('change', _.debounce((codeMirror, changeObj) => {
      const payload = {
        text: codeMirror.getValue()
      }
      if (changeObj.origin !== 'setValue') {
        $.post('/editor', payload)
          .fail(xhrFailHandler)
      }
    }, EDITOR_DEBOUNCE, { trailing: true }))
    return codeMirror
  }

  const connectWs = codeMirror => {
    const ws = new WebSocket(`ws://${window.document.location.host}`)
    ws.onmessage = (event) => codeMirror.setValue(event.data)
    ws.onclose = (event) => {
      $errorPanel.show()
      throw new Error(`WS closed - CODE: ${event.code}, REASON: ${event.reason}`)
    }
  }

  const init = () => {
    $.get('/editor')
      .done((res) => {
        let codeMirror = createCodeMirror(res.text)
        connectWs(codeMirror, res.wsPort)
      })
      .fail(xhrFailHandler)
  }

  init()
})
import "./dialog.css"
import {useContext, createContext, useState, useEffect } from "react"
import SyntaxHighlighter from 'react-syntax-highlighter'
import {atomOneDark} from 'react-syntax-highlighter/dist/esm/styles/hljs'
import {FontAwesomeIcon as FAI} from "@fortawesome/react-fontawesome"
import {
	faDownload as iDownload,
	faExpandAlt as iFullscreen
} from "@fortawesome/free-solid-svg-icons"
import { createUrl } from "./utils"

const CodeViewerContext = createContext();

function useCodeFetcher() {
	const { url, close, meta } = useContext(CodeViewerContext);
	const [code, setCode] = useState("")

	useEffect(() => {
		if (!url)
			setCode("");
		else
			fetch(url).then(res => {
				if (!res.ok)
					setCode("")
				res.text().then(setCode)
			})
	}, [url]);
	return [url, code, close, meta];
}

function Code(props) {
	return (
	<SyntaxHighlighter language="bash" style={atomOneDark} showLineNumbers={true}>
		{props.code}
	</SyntaxHighlighter>
	)

}


function CodeViewer() {
	const [url, code, close, meta] = useCodeFetcher();
	const { taskIndex, checkIndex, filename } = meta;
	const [isFullscreen, setFullscreen] = useState(false);
	const toggleFullscreen = () => isFullscreen ?
		document.exitFullscreen() : document.body.requestFullscreen();
	useEffect(() => {
		const handler = _ => setFullscreen(!!document.fullscreenElement);
		const key_handler = e => (
			(e.key == "Escape" && close()) ||
			(e.key == "f" && code && toggleFullscreen())
		)
		document.body.addEventListener("fullscreenchange", handler)
		document.body.addEventListener("keydown", key_handler);
		return () => {
			document.body.removeEventListener("fullscreenchange", handler)
			document.body.removeEventListener("keydown", key_handler)
		}
	}, [code])

	return (
	code ?
		isFullscreen ? <div className="fullscreen">
			<p className="close" onClick={toggleFullscreen}>&times;</p>
			<Code code={code} />
		</div> :
		<div className="dialog">
			<div className="dialog-header">
				<h3 className="title">
					file: {createUrl(taskIndex, checkIndex, filename)}
				</h3>
				<div className="tools">
					<span className="btn" onClick={toggleFullscreen}>
						<FAI icon={iFullscreen} />
					</span>
					<a href={url} className="btn"><FAI icon={iDownload}/></a>
					<p className="close btn" onClick={close}>&times;</p>
				</div>
			</div>
			<Code code={code} />
		</div>
	: <></>
	);
}

export function CodeViewerProvider(props) {
	const [url, setUrl] = useState("");
	const [meta, setMeta] = useState({});
	const open = (filename, taskIndex, checkIndex) => {
		setMeta({filename, taskIndex, checkIndex})
		setUrl(`/assets/files/${taskIndex}/${checkIndex}/${filename}`)
	}
	const close = () => setUrl("")

	return <CodeViewerContext.Provider value={{url, setUrl, meta, setMeta, open, close}}>
		<CodeViewer />
		{props.children}
	</CodeViewerContext.Provider>
}

export const useCodeViewer = () => useContext(CodeViewerContext);

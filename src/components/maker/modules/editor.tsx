import { PureComponent, ReactElement } from "react";
import { INDEX_EDIT, INDEX_PREVIEW, INDEX_UPLOAD } from "src/constants/editor";
import UploadInteraction from "src/lib/editor/uploadInteraction";
import MakerMain from "src/lib/webgl/maker";
import styles from "src/styles/layout/maker/index.module.scss"

interface Props {
	modeIndex: number;
	segment: number;
	onUpload: () => void
}

interface State {
	isPlaying: boolean;
}

/**
 * 編集画面
 */
export default class Editor extends PureComponent<Props, State> {

	private _webgl?: MakerMain  // webgl
	private _uploadInteraction?: UploadInteraction

	/**
	 * コンストラクタ
	 * @param props
	 */
	constructor(props: Props) {
		super(props)
		this.state = {
			isPlaying: false
		}
	}

	componentDidMount() {
		const { modeIndex } = this.props

		modeIndex == INDEX_EDIT && this._edit()
		modeIndex == INDEX_PREVIEW && this._preview()
		modeIndex == INDEX_UPLOAD && this._upload()
	}

	componentDidUpdate(prevProps: Props, prevState: State) {
		const { isPlaying } = this.state
		const { modeIndex, segment } = this.props

		if(prevState.isPlaying != isPlaying) {
			isPlaying ? this._play() : this._stop()
		}

		if(prevProps.modeIndex != modeIndex) {
			modeIndex == INDEX_EDIT && this._edit()
			modeIndex == INDEX_PREVIEW && this._preview()
			modeIndex == INDEX_UPLOAD && this._upload()
		}

		if(prevProps.segment != segment) {
			this._divide(segment)
		}
	}

	public reset(): void {
		this._webgl?.reset()
	}

	private _togglePlayMode = (): void => {
		this.setState({ isPlaying: !this.state.isPlaying })
	}

	private _divide(segment: number): void {
		this._webgl?.divide(segment)
	}

	private _edit(): void {
		this._webgl?.edit()
		this.setState({ isPlaying: false })
		this._uploadInteraction?.end()
	}

	private _preview(): void {
		this._webgl?.preview()
		this._uploadInteraction?.end()
	}

	private _upload(): void {
		this._webgl?.upload()
		this.setState({ isPlaying: false })
		this._uploadInteraction?.start()
	}

	private _play(): void {
		this._webgl?.play()
	}

	private _stop(): void {
		this._webgl?.stop()
	}

	private _onUpdateUpload = (y: number): void => {
		this._webgl?.updateByProgress(y/10)
	}

	private _onEndUpload = (): void => {
		this.props.onUpload()
	}

	/**
	 * canvasラッパーのref
	 * @param node
	 * @returns
	 */
	private _onRef = (node: HTMLDivElement): void => {
		if(!node) return
		this._webgl = new MakerMain(node)
		this._webgl.init()
		this._uploadInteraction = new UploadInteraction(node)
		this._uploadInteraction.on(UploadInteraction.UPDATE, this._onUpdateUpload)
		this._uploadInteraction.on(UploadInteraction.END, this._onEndUpload)
	}

	public render(): ReactElement {
		const { modeIndex } = this.props
		const { isPlaying } = this.state
		const btnClass = isPlaying ? styles.is_stop : ""
		const wrapperClass = modeIndex == INDEX_UPLOAD ? styles.is_upload : ""
		return (
			<div ref={this._onRef} className={`${styles.editor} ${wrapperClass}`}>
				{/* play button */}
				{
					modeIndex == INDEX_PREVIEW && (
					<a
						href="#"
						className={btnClass}
						onClick={this._togglePlayMode}
					></a>
					)
				}
			</div>
		)
	}

}
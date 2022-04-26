import { Component, ReactElement } from "react";
import Editor from "./modules/editor";
import Pager from "./modules/pager";
import ToolBar from "./modules/toolBar";
import styles from "src/styles/layout/maker/index.module.scss"
import { SEGMENT_DEFAULT } from "src/constants/common";

interface State {
	modeIndex: number;
	segment: number;
}


/**
 *
 */
export default class Index extends Component<{}, State> {

	private _editor: Editor | null = null
	private _pager: Pager | null = null

	constructor(props: {}) {
		super(props)
		this.state = {
			modeIndex: 0,
			segment: SEGMENT_DEFAULT
		}
	}

	/**
	 * モード切替
	 * @param modeIndex
	 */
	private _onChangeMode = (modeIndex: number): void => {
		this.setState({ modeIndex })
	}

	/**
	 * 分割
	 * @param segment
	 */
	private _onDivide = (segment: number): void => {
		this.setState({ segment })
	}

	/**
	 *
	 */
	private _onReset = (): void => {
		this._editor?.reset()
		this.setState({ segment: SEGMENT_DEFAULT })
	}

	private _onUpload = (): void => {
		this._pager?.changeMode(0)
	}

	public render(): ReactElement {
		const { modeIndex, segment } = this.state

		return (
			<main className={styles.container}>
				<ToolBar
					modeIndex={modeIndex}
					segment={segment}
					onDivide={this._onDivide}
					onReset={this._onReset}
				/>
				<Editor
					modeIndex={modeIndex}
					segment={segment}
					onUpload={this._onUpload}
					ref={node => this._editor = node}
				/>
				<Pager
					onChangeMode={this._onChangeMode}
					ref={node => this._pager = node}
				/>
			</main>
		);
	}
}
import Line from "./line"
import Points from "./points"
import Shape from "./shape"

const isClient = typeof window !== "undefined"
const Container = isClient ? require("pixi.js").Container : class { }
const Graphics = isClient ? require("pixi.js").Graphics : class { }
const Vec2 = isClient ? require("vec2") : undefined

/**
 * 生物の形
 */
export default class CreatureShape extends Container {

	public type: string = "not definced"
	private _points: (typeof Vec2)[] = []  // 頂点情報の配列
	private _segmentRatio: number = 2  // 分割数の倍率
	private _isEditing: boolean = false  // 編集モードかどうか, falseならプレビューモード

	/**
	 *
	 * @param base ベースとなるSVG頂点
	 * @param type 生き物の種類
	 */
	constructor(points: (typeof Vec2)[], type: string) {
		super()
		this.type = type
		this._points = points
	}

	/**
	 * 初期化
	 */
	public init(): void {
		// TODO: ここハードコードなので
		const pointsRect = new Vec2(300, 300)
		const stageSize = new Vec2(300, 300)

		const points = this._points.map(p => p.divide(pointsRect).multiply(stageSize))
		const p = new Points()
		p.update(points)
		const s = new Shape()
		s.update(points)
		const l = new Line()
		l.update(points)

		this.addChild(p, s, l)
	}

	/**
	 * プレビューモード
	 */
	public preview(): void {
		// TODO: モード切替

		this._isEditing = false
	}

	/**
	 * 編集モード
	 */
	public edit(): void {
		// TODO: モード切替

		this._isEditing = true
	}

	/**
	 * 再生（プレビューモードのみ）
	 */
	public play(): void {
		if (this._isEditing) return

	}

	/**
	 * 記録（プレビューモードのみ）
	 * @param num パラパラのコマ数
	 * @return {string[]} base64の配列
	 */
	public record(num: number): string[] {
		if (this._isEditing) return []

		return []
	}

	/**
	 * 分割数を変更（編集モードのみ）
	 * @param ratio 1 ~ 4の整数
	 */
	public divide(ratio: number): void {
		if (!this._isEditing) return

	}

}
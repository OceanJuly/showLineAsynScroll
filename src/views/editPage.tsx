import { useEffect, useRef } from 'react'

function EditPage() {
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const numbersRef = useRef<HTMLDivElement>(null)
	const textareaStyles = useRef<CSSStyleDeclaration>()
	const canvas = document.createElement('canvas')
	const context = canvas.getContext('2d')

	// 计算行数
	const calcStringLines = (sentence: string, width: number) => {
		if (!width) return 0
		const words = sentence.split('')
		let lineCount = 0
		let currentLine = ''
		for (let i = 0; i < words.length; i++) {
			const wordWidth = context?.measureText(words[i]).width || 0
			const lineWidth = context?.measureText(currentLine).width || 0
			if (lineWidth + wordWidth > width) {
				lineCount++
				currentLine = words[i]
			} else {
				currentLine += words[i]
			}
		}
		if (currentLine.trim() !== '') lineCount++
		return lineCount
	}
	const calcLines = () => {
		if (!textareaStyles.current) return []
		const textarea = textareaRef.current
		const lines = textarea?.value.split('\n') || []
		const textareaWidth = textarea?.getBoundingClientRect().width || 0
		const textareaScrollWidth = textareaWidth - (textarea?.clientWidth || 0)
		const parseNumber = (v: string) =>
			v.endsWith('px') ? parseInt(v.slice(0, -2), 10) : 0
		const textareaPaddingLeft = parseNumber(
			textareaStyles.current.getPropertyValue('paddingLeft')
		)
		const textareaPaddingRight = parseNumber(
			textareaStyles.current.getPropertyValue('paddingRight')
		)
		const textareaContentWidth =
			textareaWidth -
			textareaPaddingLeft -
			textareaPaddingRight -
			textareaScrollWidth
		const numLines = lines.map((lineString) =>
			calcStringLines(lineString, textareaContentWidth)
		)
		let lineNumbers: (string | number)[] = []
		let i = 1
		while (numLines.length > 0) {
			const numLinesOfSentence = numLines.shift() || 0
			lineNumbers.push(i)
			if (numLinesOfSentence > 1) {
				Array(numLinesOfSentence - 1)
					.fill('')
					.forEach((_) => lineNumbers.push(''))
			}
			i++
		}
		return lineNumbers
	}

	// 初始化行数
	const initLineNumbers = () => {
		const lines = calcLines()
		const lineDoms = lines.map((line) => `<div>${line || '&nbsp;'}</div>`)
		if (numbersRef.current) numbersRef.current.innerHTML = lineDoms.join('')
	}

	// 初始化 line dom 样式
	const getDefLineStyleData = () => {
		;[
			'fontFamily',
			'fontSize',
			'fontWeight',
			'letterSpacing',
			'lineHeight',
			'padding'
		].forEach((property) => {
			if (numbersRef.current && textareaStyles.current)
				numbersRef.current.style[property as any] =
					textareaStyles.current.getPropertyValue(property)
		})
	}

	// 处理 Resize 事件
	const initResize = () => {
		const textarea = textareaRef.current
		const ro = new ResizeObserver(() => {
			const rect = textarea?.getBoundingClientRect()
			if (numbersRef.current)
				numbersRef.current.style.height = `${rect?.height}px`
			initLineNumbers()
		})
		if (textarea) {
			ro.observe(textarea)
			textarea.addEventListener('scroll', () => {
				if (numbersRef.current)
					numbersRef.current.scrollTop = textarea.scrollTop
			})

			textarea.addEventListener('input', () => {
				initLineNumbers()
			})
		}
	}

	useEffect(() => {
		// 获取文本域的所有样式
		getDefLineStyleData()
		textareaStyles.current = window.getComputedStyle(textareaRef.current!)
		if (textareaStyles.current) {
			const font = `${textareaStyles.current.getPropertyValue('fontSize')} ${textareaStyles.current.getPropertyValue('fontFamily')}`
			if (context) context.font = font
		}
		initResize()
		initLineNumbers()
	}, [])
	return (
		<div className="w-[400px] overflow-hidden border border-solid border-gray flex">
			<div ref={numbersRef} className="numbers"></div>
			<textarea
				ref={textareaRef}
				className="w-[370] p-5 border-none outline-none text-[20px] box-border resize-y min-h-[10rem] min-w-[20rem]"
			>
				将进酒 唐代：李白 君不见，黄河之水天上来，奔流到海不复回。
				君不见，高堂明镜悲白发，朝如青丝暮成雪。
				人生得意须尽欢，莫使金樽空对月。 天生我材必有用，千金散尽还复来。
				烹羊宰牛且为乐，会须一饮三百杯。 岑夫子，丹丘生，将进酒，杯莫停。
				与君歌一曲，请君为我倾耳听。(倾耳听 一作：侧耳听)
				钟鼓馔玉不足贵，但愿长醉不愿醒。(不足贵 一作：何足贵；不愿醒
				一作：不复醒) 古来圣贤皆寂寞，惟有饮者留其名。(古来 一作：自古；惟
				通：唯) 陈王昔时宴平乐，斗酒十千恣欢谑。
				主人何为言少钱，径须沽取对君酌。
				五花马，千金裘，呼儿将出换美酒，与尔同销万古愁。
			</textarea>
		</div>
	)
}

export default EditPage

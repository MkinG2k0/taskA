import React, { FC, useState } from 'react'
import './Components/Style/app.scss'
import { usePersistedState } from './Hook/Hooks'
import { validDate } from './Helper/Helper'
import { set, get } from 'idb-keyval'
import { motion } from 'framer-motion'

interface Item {
	id: string
	text: string
	checked: boolean
}

function App() {
	const [value, setValue] = useState('')
	const [list, setList] = usePersistedState<Item[]>('list', [])

	const onChange = (e) => {
		setValue(e.target.value)
	}

	const onKeyPress = (e) => {
		if (e.key === 'Enter') {
			if (list) setList([...list, {
				id: new Date().toISOString(),
				checked: false,
				text: value,
			}])
			setValue('')
		}
	}
	const container = {
		hidden: {opacity: 0},
		show: {
			opacity: 1,
			transition: {
				delayChildren: 1,
			},
		},
	}

	return (
		<div className="App">
			<motion.ul
				className={'list'}
				variants={container}
				initial="hidden"
				animate="show"
			>
				<input value={value} onChange={onChange} onKeyPress={onKeyPress}/>
				{list && list.map((el) => <ListItem {...el} key={el.id}/>)}
			</motion.ul>
		</div>
	)
}

const ListItem: FC<Item> = ({id, checked, text}) => {

	const time = validDate(new Date(id))
	const [checkedBtn, setCheckedBtn] = useState(checked)

	const classBtn = `checkbox ${checkedBtn && 'checked'}`

	const onToggle = () => {
		get('list').then((el: Item[]) => {
			// const nedList = el.filter((element) => id !== element.id)
			const nedList = el.map((element) => {
				if (id !== element.id) element.checked = !element.checked
				return element
			})
			set('list', [...nedList])
		})
		setCheckedBtn(prevState => !prevState)
	}

	const onRemove = () => {
		get('list').then((el: Item[]) => {
			const nedList = el.filter((element) => id !== element.id)
			set('list', [...nedList])
		})
	}

	const item = {
		hidden: {opacity: 0},
		show: {opacity: 1},
	}

	return (
		<div className={'wrapItem'}>
			<motion.li
				dragConstraints={{left: -60, right: 60}}
				onDragEnd={onRemove}
				className={'item'}
				variants={item}
				drag={'x'}
			>
				<div className={'colText'}>
					<span className={'text'}> {text} </span>
					<span className={'time'}> {time} </span>
				</div>
				<div className={'rightSide'}>
					<div
						className={classBtn}
						onClick={onToggle}
					/>
				</div>
			</motion.li>
		</div>
	)
}

export default App

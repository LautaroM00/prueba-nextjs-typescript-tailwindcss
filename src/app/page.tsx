'use client'
import { FC, ReactNode, useEffect, useRef } from "react";
import { useState } from "react";
import { evaluate } from "mathjs"


export default function Home() {
    const [count, setCount] = useState<string>("0")

    const numbers: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "00"];
    const operators: string[] = ["+", "-", "*", "/"];


    const handleGlobalKeyDown = (event: React.KeyboardEvent<HTMLElement>): void => {
        console.log('Tecla: ', event.key)
        if (numbers.includes(event.key)) {
            writeNumbers(String(event.key))
        }
        if (operators.includes(event.key)) {
            writeOperator(` ${event.key} `)
        }
        if (event.key === 'Enter') {
            resolveCalculation()
        }
        if (event.key === 'Backspace' || event.key === 'Delete' || event.key === 'Escape') {
            resetCount()
        }
    };


    const writeNumbers = (number: string): void => {
        console.log(count)
        if (count === 'ERROR' || count === 'Infinity' || count === 'NaN' || count === '-Infinity') {
            setCount(number)
            return
        }
        if (count.startsWith("0")) {
            setCount(number)
            return
        }
        setCount((prevCount) => prevCount + number)

        return
    }

    const writeOperator = (operator: string): void => {
        if (count === 'ERROR' || count === 'Infinity' || count === 'NaN' || count === '-Infinity') {
            if (operator === ' - ') {
                setCount(operator)
            }
            return
        }
        if (count.startsWith("0")) {
            if (operator === ' - ') {
                setCount(operator)
            }
            return
        }
        if (count[1] === '-' && count.length == 3) {
            if (operator === ' + ') {
                setCount('0')
            }
            return
        }
        if (operators.some((operator) => operator === count[count.length - 2])) {
            setCount((prevCount: string): string => {
                const newCount: string = prevCount.slice(0, prevCount.length - 2) + operator
                return newCount
            })
            return
        }
        setCount((prevCount) => prevCount + operator)
        return
    }

    const resolveCalculation = (): void => {
        try {
            setCount(String(evaluate(count)))
        }
        catch (err) {
            if (err instanceof Error && err.message.includes('Unexpected end of expression')) {
                setCount('ERROR')
                setTimeout(() => {
                    setCount('0')
                }, 1000)
            }
        }
    }

    const resetCount = (): void => {
        if (count === 'ERROR') {
            return
        }
        setCount('0')
    }


    return (
        <main className="w-screen h-screen flex justify-center items-center" tabIndex={0} onKeyDown={handleGlobalKeyDown}>
            <div className="bg-calculator p-4 flex flex-col gap-3 rounded-xl">
                <Header count={count} />
                <Botonera numbers={numbers} operators={operators} writeNumbers={writeNumbers} writeOperator={writeOperator} />
                <div className="flex flex-row justify-between">
                    <button onClick={resolveCalculation} className="w-80 h-10 bg-green-700 rounded-lg text-3xl hover:bg-green-800 active:bg-green-600">=</button>
                    <button onClick={resetCount} className="bg-red-600 w-16 rounded-lg text-3xl hover:bg-red-700 active:bg-red-500">C</button>
                </div>
            </div>
        </main>
    );
}

interface HeaderProps {
    count: string
}

const Header: FC<HeaderProps> = ({ count }) => {
    const headerRef = useRef<HTMLSpanElement>(null);


    useEffect(() => {
        if (headerRef.current) {
            headerRef.current.scrollLeft = headerRef.current.scrollWidth // Asigno el ancho del contenedor al scroll
        }
    }, [count]);

    return (
        <div className="w-96 h-20  text-nowrap flex justify-end items-center px-7 py-3 text-4xl bg-slate-500/20 rounded-full max-w-full">
            <span className="overflow-auto" ref={headerRef}>
                {count}
            </span>
        </div>
    )
}


interface BotoneraProps {
    numbers: string[],
    operators: string[],
    writeNumbers: Function,
    writeOperator: Function
}


const Botonera: FC<BotoneraProps> = ({ numbers, operators, writeNumbers, writeOperator }) => {
    return (
        <div className="flex gap-5">
            <div className="w-80 grid grid-cols-3 gap-3 bg-white/10 p-3 rounded-xl">
                {numbers.map((number): ReactNode => (
                    <button key={number} onClick={() => writeNumbers(number)} className=" bg-cyan-700 p-3 rounded-md hover:bg-cyan-800 active:bg-cyan-600 text-3xl">
                        {number}
                    </button>
                ))}
            </div>
            <div className="flex flex-col justify-between items-center py-1">
                {operators.map((operator): ReactNode => (
                    <button key={operator} onClick={() => writeOperator(` ${operator} `)} className="w-14 h-14 rounded-xl bg-slate-300 text-black text-4xl hover:bg-slate-400 active:bg-slate-200">{operator}</button>
                )
                )}
            </div>
        </div>
    )
}

import React, {forwardRef, MutableRefObject, useCallback, useEffect, useImperativeHandle, useState} from 'react';
import {Controller, useForm} from "react-hook-form";
import {useSelector} from "react-redux";
import {useAlert} from 'react-alert';
import {RootState} from "../../../../store/store";
import "./index.css";

interface Props {
    word: MutableRefObject<string>,
    onWordSet: () => void;
    onSkipWord: () => void;
}

const ControlWord = forwardRef(({word,onWordSet,onSkipWord}: Props, ref) => {

    const {control, getValues, formState: {isValid, errors}, trigger, resetField} = useForm({
        mode: "all", defaultValues: {
            word: ""
        }
    });
    const alert = useAlert();

    const {gameId} = useSelector((state: RootState) => state.appStateSlice);

    const [isSettingWord, setIsSettingWord] = useState(true);

    useImperativeHandle(ref, () => {
        return {
            showSettingWord() {
                setIsSettingWord(true);
                resetField("word");
            },
            hideSettingWord() {
                setIsSettingWord(false);
            }
        }
    });

    useEffect(() => {
        trigger();
    }, []);


    const setWord = useCallback((e) => {
        e.preventDefault();
        if (!isValid) {
            alert.show(errors[Object.keys(errors)[0]]['message'])
        } else {
            word.current = getValues("word");
            setIsSettingWord(false);
            onWordSet();
        }
    }, [isValid, errors]);

    return (
        <>
            <div className='controlword'>
                <h4>
                    Session code: {gameId}
                </h4>

                <Controller
                    control={control}
                    name={"word"}
                    render={({field}) => <input className='inputword' disabled={!isSettingWord} {...field}/>}
                    rules={{
                        validate: {
                            isNotBlank: v => (v && v.trim() !== "") || "Enter session word"
                        }
                    }}
                />
                <button className='btn_skip_next' type={"button"} onClick={isSettingWord ? setWord : onSkipWord}>{isSettingWord ? "NEXT" : "SKIP"}</button>
            </div>
        </>
    );
});

export default ControlWord;
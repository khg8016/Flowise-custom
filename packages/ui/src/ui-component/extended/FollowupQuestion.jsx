import { useDispatch } from 'react-redux'
import { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { enqueueSnackbar as enqueueSnackbarAction, closeSnackbar as closeSnackbarAction, SET_CHATFLOW } from '@/store/actions'

// material-ui
import { Button, Box, Switch } from '@mui/material'
import { IconX, IconBulb } from '@tabler/icons-react'

// Project import
import { StyledButton } from '@/ui-component/button/StyledButton'

// store
import useNotifier from '@/utils/useNotifier'

// API
import chatflowsApi from '@/api/chatflows'
import { TextField } from '@mui/material'

const FollowupQuestion = ({ dialogProps }) => {
    const dispatch = useDispatch()

    useNotifier()

    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    const [chatbotConfig, setChatbotConfig] = useState({})

    const [prompt, setPrompt] = useState('')

    // const [isFollowupQuestionOn, setIsFollowupQuestionOn] = useState(false)

    const handleChange = (evnt) => {
        const { value } = evnt.target
        setPrompt(value)
    }

    const onSave = useCallback(async () => {
        try {
            // chatbotConfig.isFollowupQuestionOn = value.isFollowupQuestionOn
            chatbotConfig.followupQuestionPrompt = prompt
            const saveResp = await chatflowsApi.updateChatflow(dialogProps.chatflow.id, {
                chatbotConfig: JSON.stringify(chatbotConfig)
            })
            if (saveResp.data) {
                enqueueSnackbar({
                    message: 'Conversation Guided Answer Saved',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'success',
                        action: (key) => (
                            <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
                dispatch({ type: SET_CHATFLOW, chatflow: saveResp.data })
            }
        } catch (error) {
            enqueueSnackbar({
                message: `Failed to save Conversation Guided Answer: ${
                    typeof error.response.data === 'object' ? error.response.data.message : error.response.data
                }`,
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                    persist: true,
                    action: (key) => (
                        <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                            <IconX />
                        </Button>
                    )
                }
            })
        }
    }, [prompt, chatbotConfig])

    useEffect(() => {
        if (dialogProps.chatflow && dialogProps.chatflow.chatbotConfig) {
            try {
                let chatbotConfig = JSON.parse(dialogProps.chatflow.chatbotConfig)
                setChatbotConfig(chatbotConfig || {})
                if (chatbotConfig.followupQuestionPrompt && chatbotConfig.followupQuestionPrompt !== '') {
                    setPrompt(chatbotConfig.followupQuestionPrompt)
                    // setIsFollowupQuestionOn(true)
                } else {
                    // setIsFollowupQuestionOn(false)
                }
            } catch (e) {
                // setIsFollowupQuestionOn(false)
            }
        }

        return () => {}
    }, [dialogProps])

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 10,
                    background: '#d8f3dc',
                    padding: 10,
                    marginBottom: '20px'
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    <IconBulb size={30} color='#2d6a4f' />
                    <span style={{ color: '#2d6a4f', marginLeft: 10, fontWeight: 500 }}>Write a prompt for Follow-up Questions</span>
                </div>
            </div>
            <Box sx={{ width: '100%', mb: 1 }}>
                <TextField style={{ width: '100%' }} multiline onChange={(e) => handleChange(e)} value={prompt} minRows={10} />
            </Box>
            {/* <Box sx={{ '& > :not(style)': { m: 1 }, pt: 2 }}>
                <Switch
                    checked={isFollowupQuestionOn}
                    onChange={(e) => {
                        setIsFollowupQuestionOn(e.target.checked)
                    }}
                />
            </Box> */}
            <StyledButton variant='contained' onClick={onSave}>
                Save
            </StyledButton>
        </>
    )
}

FollowupQuestion.propTypes = {
    show: PropTypes.bool,
    dialogProps: PropTypes.object,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func
}

export default FollowupQuestion

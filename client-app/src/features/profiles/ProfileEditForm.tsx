import { Form, Formik } from 'formik'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { Button } from 'semantic-ui-react'
import MyTextArea from '../../app/common/form/MyTextArea'
import MyTextInput from '../../app/common/form/MyTextInput'
import { Profile } from '../../app/models/profile'
import { useStore } from '../../app/stores/store'
import * as Yup from 'yup'

interface Props {
    formSubmit: (profile: Partial<Profile>) => void
}

export default observer(function ProfileEditForm({formSubmit}: Props) {

    const {profileStore} = useStore()
    const {profile} = profileStore
    const validationSchema = Yup.object({
        displayName: Yup.string().required('Display name is required')
    })



    return (
            <Formik
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={{displayName: profile?.displayName, bio: profile?.bio}}
                onSubmit={values => formSubmit(values)}
            >
            {({handleSubmit, isSubmitting, isValid, dirty}) => (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <MyTextInput name='displayName' placeholder='Display Name' />
                    <MyTextArea name='bio' placeholder='Add your bio' rows={3} />
                    <Button
                        disabled={isSubmitting || !isValid || !dirty}
                        loading={isSubmitting}
                        floated='right'
                        positive
                        type='submit'
                        content='Update profile' 
                    />
                </Form>
            )
            }
            </Formik>
    )
})

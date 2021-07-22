import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { Button, Grid, Header, Tab } from 'semantic-ui-react'
import { Profile } from '../../app/models/profile'
import { useStore } from '../../app/stores/store'
import ProfileEditForm from './ProfileEditForm'

interface Props {
    profile: Profile
}
export default observer(function ProfileAbout({profile}: Props) {
    const { profileStore: { isCurrentUser, loading, editProfile} } = useStore();
    const [editMode, setEditMode] = useState(false)

    function handleFormSubmit(values: Partial<Profile>) {
        let newProfile = {
            ...profile,
            ...values
        }
        editProfile(newProfile).then(() => setEditMode(false))
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='user' content={`About ${profile.displayName}`} />
                    {isCurrentUser && (
                        <Button
                            floated='right'
                            basic
                            content={editMode ? 'Cancel' : 'Edit profile'}
                            onClick={() => setEditMode(!editMode)}
                        />
                    ) }
                </Grid.Column>
                <Grid.Column width={16}>
                    {editMode ? (
                        <ProfileEditForm formSubmit={handleFormSubmit} />
                    ) : (
                        <p style={{whiteSpace: 'pre-wrap'}}>{profile.bio}</p>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})

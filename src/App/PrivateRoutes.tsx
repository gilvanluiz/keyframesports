import * as React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { GameFootage } from 'src/Features/GameFootage';
import { TelestrationRoutes } from 'src/Features/Telestrations/Routes';
import { VideoLibraryTelestrationRoutes } from 'src/Features/TelestrationsVideoLibrary/Routes';
import { TelestrationStateProvider } from 'src/Features/Telestrations/State';
import { VideoLibraryRoutes } from 'src/Features/VideoLibrary/Routes';

interface IProps {
    isUserSubscribed: boolean;
}

export const PrivateRoutes = ({ isUserSubscribed }: IProps) => {
    return isUserSubscribed ? (
        <>
            <Route
                path={['/mode/pro/game-footage/', '/mode/pro/telestrations']}
                render={(RouterProps) => (
                    <TelestrationStateProvider>
                        <GameFootage {...RouterProps} />
                        {RouterProps.location.pathname.startsWith(
                            '/mode/pro/telestrations'
                        ) && <TelestrationRoutes {...RouterProps} />}
                    </TelestrationStateProvider>
                )}
            />
            <Route
                render={(RouterProps) =>
                    RouterProps.location.pathname.startsWith(
                        '/telestrations'
                    ) && <VideoLibraryTelestrationRoutes {...RouterProps} />
                }
            />
            <Route
                path='/video-library'
                render={(RouterProps) => <VideoLibraryRoutes />}
            />
        </>
    ) : (
        <Redirect to='/payments/make-payment' />
    );
};

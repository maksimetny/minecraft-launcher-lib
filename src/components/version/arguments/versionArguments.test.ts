
import {
    VersionArguments,
} from './versionArguments';

describe('VersionArguments', () => {

    describe('#fromLegacyStringArguments', () => {

        it('should convert string game arguments to an array of resolved arguments', () => {

            const legacyArgs: string = '--username ${auth_player_name} --version ${version_name} --gameDir ${game_directory} --assetsDir ${game_assets} --uuid ${auth_uuid} --accessToken ${auth_access_token}';
            /* const args = */ VersionArguments.fromLegacyArguments(legacyArgs);

            // console.log(args.game, args.jvm)

        });

    });

});

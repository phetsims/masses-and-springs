// Copyright 2018-2021, University of Colorado Boulder

/**
 * Profile used for colors dependent on the basics version.
 *
 * There are two profiles, 'default' and 'basics' (for the Basics version of the sim)
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import Color from '../../../../scenery/js/util/Color.js';
import ProfileColorProperty from '../../../../scenery/js/util/ProfileColorProperty.js';
import massesAndSprings from '../../massesAndSprings.js';

// Initialize colors for each profile, by string key. If a basics color is not defined, it will take the
// 'default' value provided.
const MassesAndSpringsColors = {
  backgroundProperty: new ProfileColorProperty( 'background', {
    default: Color.white,
    basics: new Color( 'rgb( 255, 250, 227 )' )
  } ),
  smallMysteryMassProperty: new ProfileColorProperty( 'smallMysteryMass', {
    default: new Color( 'rgb( 246, 164, 255 )' ),
    basics: new Color( 'rgb( 185, 0, 38 )' )
  } ),
  mediumMysteryMassProperty: new ProfileColorProperty( 'mediumMysteryMass', {
    default: new Color( 'rgb( 0, 222, 224 )' ),
    basics: new Color( 'rgb( 0, 107, 161 )' )
  } ),
  largeMysteryMassProperty: new ProfileColorProperty( 'largeMysteryMass', {
    default: new Color( 'rgb( 250, 186, 75)' ),
    basics: new Color( 'rgb( 0, 104, 55 )' )
  } ),
  labeledMassProperty: new ProfileColorProperty( 'labeledMass', {
    default: new Color( 'rgb( 153, 153, 153 )' ),
    basics: new Color( 'rgb( 153, 153, 153 )' )
  } ),
  adjustableMassProperty: new ProfileColorProperty( 'adjustableMass', {
    default: new Color( 'rgb( 247, 151, 34 )' ),
    basics: new Color( 'rgb( 247, 151, 34 )' )
  } ),
  unstretchedLengthProperty: new ProfileColorProperty( 'unstretchedLength', {
    default: new Color( 'rgb( 65, 66, 232 )' )
  } ),
  restingPositionProperty: new ProfileColorProperty( 'restingPosition', {
    default: new Color( 'rgb( 0, 180, 0 )' )
  } ),
  movableLineProperty: new ProfileColorProperty( 'movableLine', {
    default: new Color( 'rgb( 255, 0, 0 )' )
  } ),
  velocityVectorProperty: new ProfileColorProperty( 'velocityVector', {
    default: PhetColorScheme.VELOCITY
  } ),
  accelerationVectorProperty: new ProfileColorProperty( 'accelerationVector', {
    default: PhetColorScheme.ACCELERATION
  } )
};

massesAndSprings.register( 'MassesAndSpringsColors', MassesAndSpringsColors );

export default MassesAndSpringsColors;
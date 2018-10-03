// Copyright 2018, University of Colorado Boulder

/**
 * Profile used for colors dependent on the basics version.
 *
 * There are two profiles, 'default' and 'basics' (for the Basics version of the sim)
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var ColorProfile = require( 'SCENERY_PHET/ColorProfile' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );

  // Initialize colors for each profile, by string key. If a basics color is not defined, it will take the
  // 'default' value provided.
  var MassesAndSpringsColorProfile = new ColorProfile( {
    background: {
      default: Color.white,
      basics: new Color('rgb( 255, 250, 227 )')
    },
    centralAtom: {
      default: new Color( 159, 102, 218 ),
      basics: new Color( 153, 90, 216 )
    },
    atom: {
      default: new Color( 255, 255, 255 )
    },
    bond: {
      default: new Color( 255, 255, 255 ),
      basics: new Color( 230, 230, 230 )
    },
    controlPanelBorder: {
      default: new Color( 210, 210, 210 ),
      basics: new Color( 30, 30, 30 )
    },
    controlPanelTitle: {
      default: new Color( 240, 240, 240 ),
      basics: new Color( 0, 0, 0 )
    },
    controlPanelText: {
      default: new Color( 230, 230, 230 ),
      basics: new Color( 0, 0, 0 )
    },
    realExampleFormula: {
      default: new Color( 230, 230, 230 )
    },
    realExampleBorder: {
      default: new Color( 60, 60, 60 )
    },
    lonePairShell: {
      default: new Color( 255, 255, 255, 0.7 )
    },
    lonePairElectron: {
      default: new Color( 255, 255, 0, 0.8 )
    },
    moleculeGeometryName: {
      default: new Color( 255, 255, 140 ),
      basics: new Color( 0, 0, 0 )
    },
    electronGeometryName: {
      default: new Color( 255, 204, 102 ),
      basics: new Color( 0, 0, 0 )
    },
    bondAngleReadout: {
      default: new Color( 255, 255, 255 ),
      basics: new Color( 0, 0, 0 )
    },
    bondAngleSweep: {
      default: new Color( 128, 128, 128 ),
      basics: new Color( 84, 122, 165 )
    },
    bondAngleArc: {
      default: new Color( 255, 0, 0 ),
      basics: new Color( 0, 0, 0 )
    },
    removeButtonText: {
      default: new Color( 0, 0, 0 )
    },
    removeButtonBackground: {
      default: new Color( 255, 200, 0 )
    },
    checkbox: {
      default: new Color( 230, 230, 230 ),
      basics: new Color( 0, 0, 0 )
    },
    checkboxBackground: {
      default: new Color( 30, 30, 30 ),
      basics: new Color( 255, 255, 255 )
    },
    removePairGroup: {
      default: new Color( '#d00' )
    }
  }, [ 'default', 'basics' ] );

  massesAndSprings.register( 'MassesAndSpringsColorProfile', MassesAndSpringsColorProfile );

  return MassesAndSpringsColorProfile;
} );


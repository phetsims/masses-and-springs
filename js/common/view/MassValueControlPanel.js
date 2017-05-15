// Copyright 2016, University of Colorado Boulder

/**
 * TODO: Documentation
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );
  var Panel = require( 'SUN/Panel' );
  var Range = require( 'DOT/Range' );

  // strings
  var massString = require( 'string!MASSES_AND_SPRINGS/mass' );

  /**
   * @param {Mass} mass
   * @param {Tandem} tandem
   * @constructor
   */
  function MassValueControlPanel( mass, tandem ) {

    Panel.call( this, new NumberControl( massString, mass.massProperty, new Range( 50, 300 ), {
      valuePattern: '{0} g',
      majorTickLength: 10,
      trackSize: new Dimension2( 100, 2 ),
      thumbSize: new Dimension2( 13, 22 ),
      titleFont: MassesAndSpringsConstants.TITLE_FONT,
      arrowButtonScale: .6,
      tandem: tandem
    } ), {
      minWidth: MassesAndSpringsConstants.PANEL_MIN_WIDTH,
      maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH,
      fill: 'rgb( 240, 240, 240 )',
      cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS
    } );
  }

  massesAndSprings.register( 'MassValueControlPanel', MassValueControlPanel );
  return inherit( Panel, MassValueControlPanel );
} );

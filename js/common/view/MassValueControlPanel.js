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
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  // var Text = require( 'SCENERY/nodes/Text' );

  // strings
  // var massString = require( 'string!MASSES_AND_SPRINGS/mass' );

  /**
   * @param {Tandem} tandem
   * @param {Mass} mass
   * @constructor
   */
  function MassValueControlPanel( mass, tandem ) {
    // var title = new Text( massString, { font: MassesAndSpringsConstants.TITLE_FONT } );
    var massProperty = new Property( mass.mass );

    massProperty.link( function( massValue ) {
      mass.mass = massValue/1000;
      console.log(massValue);
    } );

    Panel.call( this, new NumberControl( 'mass', massProperty, new Range( 50, 300 ), {
      valuePattern: '{0} g',
      majorTickLength: 10,
      trackSize: new Dimension2( 100, 2 ),
      thumbSize: new Dimension2( 13, 22 )
    } ), {
      fill: 'rgb( 240, 240, 240 )',
      cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS
    } );
  }

  massesAndSprings.register( 'MassValueControlPanel', MassValueControlPanel );
  return inherit( Panel, MassValueControlPanel );
} );

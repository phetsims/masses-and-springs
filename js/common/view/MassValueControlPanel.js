// Copyright 2016, University of Colorado Boulder

/**
 * TODO: Documentation
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  // var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );
  var Panel = require( 'SUN/Panel' );
  var Property = require ('AXON/Property');
  var Range = require( 'DOT/Range' );
  // var Text = require( 'SCENERY/nodes/Text' );

  // strings
  // var massString = require( 'string!MASSES_AND_SPRINGS/mass' );

  /**
   * @param {Tandem} tandem
   * @param {number} mass - mass of massObject
   * @constructor
   */
  function MassValueControlPanel( mass, tandem ) {
    // var title = new Text( massString, { font: MassesAndSpringsConstants.TITLE_FONT } );
    var massProperty = new Property( mass);

    Panel.call( this, new NumberControl( 'mass', massProperty, new Range( 50, 300 ) ) );
  }

  massesAndSprings.register( 'MassValueControlPanel', MassValueControlPanel );
  return inherit( Panel, MassValueControlPanel );
} );

// Copyright 2017, University of Colorado Boulder

/**
 * ComboBox used for selecting planets.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Body = require( 'MASSES_AND_SPRINGS/common/model/Body' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var ComboBox = require( 'SUN/ComboBox' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {Property.<string>} bodyProperty
   * @param {Node} listNodeParent
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function GravityComboBox( bodyProperty, listNodeParent, tandem, options ) {
    options = _.extend( {
      buttonCornerRadius: 3,
      buttonYMargin: 0,
      itemYMargin: 3,
      itemXMargin: 2,
      listYMargin: 3,
      tandem: tandem.createTandem( 'gravityComboBox' ),

      // options for body text
      bodyFont: MassesAndSpringsConstants.LABEL_FONT,
      bodyMaxWidth: 140,
      xOffset: 107
    }, options );

    //  Add gravity info for various planets
    var bodyListItems = [];
    Body.BODIES.forEach( function( body ) {
      var bodyLabel = new Text( body.title, {
        font: options.bodyFont,
        maxWidth: options.bodyMaxWidth,
        tandem: tandem.createTandem( 'bodyLabel' )
      } );
      bodyLabel.localBounds = bodyLabel.localBounds.withX( options.xOffset );
      bodyListItems.push( ComboBox.createItem( bodyLabel, body ) );
    } );

    ComboBox.call( this, bodyListItems, bodyProperty, listNodeParent, options );
  }

  massesAndSprings.register( 'GravityComboBox', GravityComboBox );

  return inherit( ComboBox, GravityComboBox );
} );
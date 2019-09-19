// Copyright 2019, University of Colorado Boulder

/**
 * ComboBox used for selecting planets.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Body = require( 'MASSES_AND_SPRINGS/common/model/Body' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  const ComboBox = require( 'SUN/ComboBox' );
  const ComboBoxItem = require( 'SUN/ComboBoxItem' );
  const MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  const Text = require( 'SCENERY/nodes/Text' );

  class GravityComboBox extends ComboBox {

    /**
     * @param {Property.<string>} bodyProperty
     * @param {Node} listNodeParent
     * @param {Tandem} tandem
     * @param {Object} [options]
     * @constructor
     */
    constructor( bodyProperty, listNodeParent, tandem, options ) {
      options = _.extend( {
        cornerRadius: 3,
        xMargin: 10,
        yMargin: 6,
        tandem: tandem.createTandem( 'gravityComboBox' ),

        // options for body text
        bodyFont: MassesAndSpringsConstants.LABEL_FONT,
        bodyMaxWidth: 140,
        xOffset: 107
      }, options );

      // {ComboBoxItem[]}
      const items = Body.BODIES.map( body => {
        const bodyLabel = new Text( body.title, {
          font: options.bodyFont,
          maxWidth: options.bodyMaxWidth,
          tandem: tandem.createTandem( 'bodyLabel' )
        } );
        bodyLabel.localBounds = bodyLabel.localBounds.withX( options.xOffset );
        return new ComboBoxItem( bodyLabel, body );
      } );

      super( items, bodyProperty, listNodeParent, options );
    }
  }

  return massesAndSprings.register( 'GravityComboBox', GravityComboBox );
} );
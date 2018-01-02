// Copyright 2016-2017, University of Colorado Boulder

/**
 * Panel responsible for adjusting the a Property of the spring using an hslider.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Panel = require( 'SUN/Panel' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  var TITLE_FONT = MassesAndSpringsConstants.TITLE_FONT;

  /**
   * @param {Property.<number>} SpringProperty - Property to be adjusted by hSlider
   * @param {Range} PropertyRange - range of values for length
   * @param {string} title - string used to title the panel
   * @param {array.<Text>} labels - formatted as: [ minLabel, maxLabel]
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function SpringControlPanel( SpringProperty, PropertyRange, title, labels, tandem, options ) {
    options = _.extend( {
      fill: MassesAndSpringsConstants.PANEL_FILL,
      xMargin: 5,
      yMargin: 5,
      cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
      visible: false,
      constrainValue: function( value ) {
        return Util.roundSymmetric( value );
      }
    }, options );

    // slider used to adjust value of natural resting length of spring
    var hSlider = new HSlider( SpringProperty, PropertyRange, {
      majorTickLength: 10,
      minorTickLength: 5,
      trackSize: new Dimension2( 120, 2 ),
      thumbSize: new Dimension2( 13, 22 ),
      thumbFillEnabled: '#00b3b3',
      thumbFillHighlighted: '#00e6e6',
      align: 'center',
      constrainValue: options.constrainValue,
      tandem: tandem.createTandem( 'hSlider' )
    } );

    hSlider.addMajorTick( PropertyRange.min, labels[ 0 ] );
    hSlider.addMajorTick( PropertyRange.min + ( PropertyRange.max - PropertyRange.min ) / 2 );
    hSlider.addMajorTick( PropertyRange.max, labels[ 1 ] );
    for ( var i = 1; i < 10; i++ ) {
      if ( i !== 5 ) {
        hSlider.addMinorTick( PropertyRange.min + i * ( PropertyRange.max - PropertyRange.min ) / 10 );
      }
    }
    Panel.call( this, new VBox( {
      align: 'center',
      children: [
        new Text( title, { font: TITLE_FONT } ),
        hSlider
      ]
    } ), options );
  }

  massesAndSprings.register( 'SpringControlPanel', SpringControlPanel );

  return inherit( Panel, SpringControlPanel );

} );

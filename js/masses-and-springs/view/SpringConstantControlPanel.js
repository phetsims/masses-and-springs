// Copyright 2016, University of Colorado Boulder

/**
 * @author Matt Pennington
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );

  var Dimension2 = require( 'DOT/Dimension2' );
  var HSlider = require( 'SUN/HSlider' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  var smallString = require( 'string!MASSES_AND_SPRINGS/small' );
  var largeString = require( 'string!MASSES_AND_SPRINGS/large' );

  var FONT = new PhetFont( 32 );

  /**
   *
   * @param {Property} springConstantProperty
   * @param {Range} springConstantPropertyRange
   * @param {String} title
   * @param {} options
   * @constructor
   */
  function SpringConstantControlPanel( springConstantProperty, springConstantPropertyRange, title, options ) {
    options = _.extend( {
      fill: 'rgb( 240, 240, 240 )',
      xMargin: 50,
      yMargin: 25
    }, options );

    var hSlider = new HSlider( springConstantProperty, springConstantPropertyRange, {
      majorTickLength: 20,
      minorTickLength: 10,
      trackSize: new Dimension2( 400, 5 ),
      thumbNode: new HSlider.ThumbNode( new Property( true ), {
        thumbSize: new Dimension2( 20, 40 ),
        thumbFillEnabled: '#00b3b3',
        thumbFillHighlighted: '#00e6e6'
      } )
    } );
    for ( var i = 1; i < springConstantPropertyRange.max; i += springConstantPropertyRange.max / 10 ) {
      if ( i !== 5 ) {
        hSlider.addMinorTick( i * springConstantPropertyRange.max / 10, new Text( '' ) );
      }
    }
    hSlider.addMajorTick( springConstantPropertyRange.min, new Text( smallString, { font: FONT, pickable: false } ) );
    hSlider.addMajorTick( springConstantPropertyRange.max, new Text( largeString, { font: FONT, pickable: false } ) );
    hSlider.addMajorTick( ( springConstantPropertyRange.max - springConstantPropertyRange.min ) / 2, new Text( '' ) );



    var springConstantVBox = new VBox();
    springConstantVBox.addChild( new Text( title , FONT ) );
    springConstantVBox.addChild( hSlider );

    Panel.call( this, springConstantVBox, options );
  }

  massesAndSprings.register( 'SpringConstantControlPanel', SpringConstantControlPanel );

  return inherit( Panel, SpringConstantControlPanel );

} );

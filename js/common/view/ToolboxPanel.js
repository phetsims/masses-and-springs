// Copyright 2016, University of Colorado Boulder

/**
 * @author Matt Pennington
 * @author Denzell Barnett
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var Property = require( 'AXON/Property' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Timer = require( 'SCENERY_PHET/Timer' );
  var Image = require( 'SCENERY/nodes/Image' );

  /**
   *
   * @param {Object} options
   * @constructor
   */
  function ToolboxPanel( rulerVisibleProperty, timerVisibleProperty, options ) {
    options = _.extend( {
      fill: 'rgb( 240, 240, 240 )',
      xMargin: 5,
      yMargin: 5,
      align: 'center',
      cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS
    }, options );

    var toolbox = new HBox( {
      align: 'center',
      spacing: 30
    } );
    Panel.call( this, toolbox, options );

    // Create timer
    var secondsProperty = new Property( 0 );
    var isRunningProperty = new Property( false );
    var timer = new Timer( secondsProperty, isRunningProperty );

    // Create ruler
    var rulerWidth = 397; // 1 meter
    var rulerLength = .175 * rulerWidth;
    var majorTickLabels = [ '' ];
    for ( var i = 1; i < 10; i++ ) { // create 10 empty strings for labels
      majorTickLabels.push( '' );
    }
    var majorTickWidth = rulerWidth / ( majorTickLabels.length - 1 );
    var ruler = new RulerNode( rulerWidth, rulerLength, majorTickWidth, majorTickLabels, '' );
    ruler.rotate( 40, false );

    // Create timer icon
    ruler.toImage( function( image ) {
      var rulerIcon = new Image( image, {
        cursor: 'pointer',
        pickable: true,
        scale: .1
      } );

      // Input listeners for the ruler icon
      rulerIcon.addInputListener( {
        down: function() {
          rulerIcon.opacity = 0;
          rulerVisibleProperty.set( true );
          // ruler.
        },
        up: function() {
          rulerIcon.opacity = 1;
          rulerVisibleProperty.set( false );
        }
      } );
      toolbox.addChild( rulerIcon );
    } );

    // Create timer icon
    timer.toImage( function( image ) {
      var timerIcon = new Image( image, {
        cursor: 'pointer',
        pickable: true,
        scale: .4
      } );

      // Input listeners for timer icon
      timerIcon.addInputListener( {
        down: function() {
          timerIcon.opacity = 0;
          timerVisibleProperty.set( true );
        },
        up: function() {
          timerIcon.opacity = 1;
          timerVisibleProperty.set( false );
        }
      } );
      toolbox.addChild( timerIcon );
    } );
  }

  massesAndSprings.register( 'ToolboxPanel', ToolboxPanel );

  return inherit( Panel, ToolboxPanel );

} );

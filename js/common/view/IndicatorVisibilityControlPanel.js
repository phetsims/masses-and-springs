// Copyright 2016-2017, University of Colorado Boulder

/**
 * Panel that manages options for visibility for reference lines.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Panel = require( 'SUN/Panel' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var VerticalCheckBoxGroup = require( 'SUN/VerticalCheckBoxGroup' );
  var VStrut = require( 'SCENERY/nodes/VStrut' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );

  // strings
  var equilibriumPositionString = require( 'string!MASSES_AND_SPRINGS/equilibriumPosition' );
  var movableLineString = require( 'string!MASSES_AND_SPRINGS/movableLine' );
  var naturalLengthString = require( 'string!MASSES_AND_SPRINGS/naturalLength' );

  // constants
  var LINE_LENGTH = 25;

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function IndicatorVisibilityControlPanel( model, tandem, options ) {

    /**
     * Creates line for visual representation within the panel.
     * @param {string} color
     * @param {Tandem} tandem
     * @returns {Line} line object with passed in color.
     */
    var createLine = function( color, tandem ) {
      return new Line( 0, 0, LINE_LENGTH, 0, {
        stroke: color,
        lineDash: [ 6, 2.5 ],
        lineWidth: 2.0,
        cursor: 'pointer',
        tandem: tandem
      } );
    };

    // Lines added for reference in panel
    var greenLine = createLine( 'rgb(93, 191, 142)', tandem.createTandem( 'greenLine' ) );
    var blueLine = createLine( 'rgb(65,66,232)', tandem.createTandem( 'blueLine' ) );
    var redLine = createLine( 'red', tandem.createTandem( 'redLine' ) );

    // REVIEW:Why does this keep raising an assertion failure (get advice from SR)
    var indicatorVisibilityCheckBoxGroup = new VerticalCheckBoxGroup( [
      {
        content: new HBox( {
          children: [ new Text(
            naturalLengthString,
            MassesAndSpringsConstants.FONT,
            { tandem: tandem.createTandem( 'naturalLengthString' ) } ),
            new HStrut( 31 ),
            blueLine
          ],
          tandem: tandem.createTandem( 'naturalLengthHBox' )
        } ),
        property: model.naturalLengthVisibleProperty,
        label: naturalLengthString
      },
      {
        content: new HBox( {
          children: [ new Text(
            equilibriumPositionString,
            MassesAndSpringsConstants.FONT,
            { tandem: tandem.createTandem( 'equilibriumPositionString' ) } ),
            new HStrut( 10 ),
            greenLine
          ],
          tandem: tandem.createTandem( 'equilibriumPositionHBox' )
        } ),
        property: model.equilibriumPositionVisibleProperty,
        label: equilibriumPositionString
      },
      {
        content: new HBox( {
          children: [ new Text(
            movableLineString,
            MassesAndSpringsConstants.FONT,
            { tandem: tandem.createTandem( 'movableLineString' ) } ),
            new HStrut( 38 ),
            redLine
          ],
          tandem: tandem.createTandem( 'movableLineHBox' )
        } ),
        property: model.movableLineVisibleProperty,
        label: movableLineString
      }
    ], { boxWidth: 15, spacing: 5, tandem: tandem.createTandem( 'indicatorVisibilityCheckBoxGroup' ) } );
    var titleToControlsVerticalSpace = 2;
    var indicatorVisibilityControlsVBox = new VBox( {
      children: [
        new VStrut( titleToControlsVerticalSpace ),
        indicatorVisibilityCheckBoxGroup
      ],
      align: 'left',
      tandem: tandem.createTandem( 'indicatorVisibilityControlsVBox' )
      }
    );
    Panel.call( this,
      indicatorVisibilityControlsVBox,
      {
        xMargin: 10,
        fill: 'rgb( 240, 240, 240 )',
        cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
        tandem: tandem.createTandem( 'indicatorVisibilityControlPanel' )
      }
    );
    this.mutate( options );
  }
  massesAndSprings.register( 'IndicatorVisibilityControlPanel', IndicatorVisibilityControlPanel );

  return inherit( Panel, IndicatorVisibilityControlPanel );
} );
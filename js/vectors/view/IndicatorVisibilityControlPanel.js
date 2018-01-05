// Copyright 2017, University of Colorado Boulder

/**
 * Panel that manages options for visibility of reference lines.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var DisplacementArrowNode = require( 'MASSES_AND_SPRINGS/vectors/view/DisplacementArrowNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Panel = require( 'SUN/Panel' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var VerticalCheckBoxGroup = require( 'SUN/VerticalCheckBoxGroup' );
  var VStrut = require( 'SCENERY/nodes/VStrut' );

  // strings
  var equilibriumPositionString = require( 'string!MASSES_AND_SPRINGS/equilibriumPosition' );
  var movableLineString = require( 'string!MASSES_AND_SPRINGS/movableLine' );
  var displacementString = require( 'string!MASSES_AND_SPRINGS/displacement' );

  // constants
  var LINE_LENGTH = 25;

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function IndicatorVisibilityControlPanel( model, tandem, options ) {
    options = _.extend( {
      xMargin: 10,
      fill: MassesAndSpringsConstants.PANEL_FILL,
      cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
      tandem: tandem.createTandem( 'indicatorVisibilityControlPanel' ),
      minWidth: MassesAndSpringsConstants.PANEL_MIN_WIDTH
    }, options );
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
    var greenLine = createLine( 'rgb( 93, 191, 142 )', tandem.createTandem( 'greenLine' ) );
    var displacementSymbol = new DisplacementArrowNode(
      new Property( 10 ),
      new Property( true ),
      tandem,
      {
        modelViewTransform: this.modelViewTransform,
        symbolRepresentation: true,
      }
    );
    displacementSymbol.scale( .65 );
    var redLine = createLine( 'red', tandem.createTandem( 'redLine' ) );

    var indicatorVisibilityCheckBoxGroup = new VerticalCheckBoxGroup( [
      {
        content: new HBox( {
          children: [ new Text(
            displacementString,
            { font: MassesAndSpringsConstants.FONT, tandem: tandem.createTandem( 'displacementString' ) } )
          ],
          tandem: tandem.createTandem( 'displacementHBox' )
        } ),
        property: model.displacementVisibleProperty,
        label: displacementString
      },
      {
        content: new HBox( {
          children: [ new Text(
            equilibriumPositionString,
            { font: MassesAndSpringsConstants.FONT, tandem: tandem.createTandem( 'equilibriumPositionString' ) } )
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
            { font: MassesAndSpringsConstants.FONT, tandem: tandem.createTandem( 'movableLineString' ) } )
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
    var lineVBox = new VBox( {
      children: [
        new VStrut( titleToControlsVerticalSpace ),
        displacementSymbol,
        new VStrut( 17 ),
        greenLine,
        new VStrut( 17 ),
        redLine,
        new VStrut( titleToControlsVerticalSpace )
      ]
    } );
    var controlBox = new HBox( {
      children: [
        indicatorVisibilityControlsVBox,
        new HStrut( 10 ),
        lineVBox,
        new HStrut( 10 )
      ]
    } );

    Panel.call( this, controlBox, options );
  }

  massesAndSprings.register( 'IndicatorVisibilityControlPanel', IndicatorVisibilityControlPanel );

  return inherit( Panel, IndicatorVisibilityControlPanel );
} );
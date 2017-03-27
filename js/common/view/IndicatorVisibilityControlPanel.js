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
  var Node = require( 'SCENERY/nodes/Node' );
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
    Node.call( this );
    var self = this;

    // Lines added for reference in panel
    var greenLine = this.createLine( 'rgb(93, 191, 142)' );
    var blueLine = this.createLine( 'rgb(65,66,232)' );
    var redLine = this.createLine( 'red' );

    var indicatorVisibilityCheckBoxGroup = new VerticalCheckBoxGroup( [
      {
        content: new HBox( {
          children: [ new Text( naturalLengthString, MassesAndSpringsConstants.FONT, { tandem: tandem.createTandem( 'naturalLengthString' ) } ), new HStrut( 31 ), blueLine ],
          tandem: tandem.createTandem( 'naturalLengthHBox' )
        } ),
        property: model.naturalLengthVisibleProperty,
        label: naturalLengthString
      },
      {
        content: new HBox( {
          children: [ new Text( equilibriumPositionString, MassesAndSpringsConstants.FONT, { tandem: tandem.createTandem( 'equilibriumPositionString' ) } ), new HStrut( 10 ), greenLine ],
          tandem: tandem.createTandem( 'equilibriumPositionString' )
        } ),
        property: model.equilibriumPositionVisibleProperty,
        label: equilibriumPositionString
      },
      {
        content: new HBox( {
          children: [ new Text( movableLineString, MassesAndSpringsConstants.FONT, { tandem: tandem.createTandem( 'movableLineString' ) } ), new HStrut( 38 ), redLine ],
          tandem: tandem.createTandem( 'movableLineString' )
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
    this.indicatorVisibilityControlPanel = new Panel(
      indicatorVisibilityControlsVBox,
      {
        xMargin: 10,
        fill: 'rgb( 240, 240, 240 )',
        cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
        tandem: tandem.createTandem( 'indicatorVisibilityControlPanel' )
      }
    );
    this.addChild( this.indicatorVisibilityControlPanel );
    this.mutate( options );

  }

  massesAndSprings.register( 'IndicatorVisibilityControlPanel', IndicatorVisibilityControlPanel );

  return inherit( Node, IndicatorVisibilityControlPanel, {
    createLine: function( color ) {
      return new Line( 0, 0, LINE_LENGTH, 0, {
        stroke: color,
        lineDash: [ 6, 2.5 ],
        lineWidth: 2.0,
        cursor: 'pointer'
      } );
    }
  } );
} );